import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Supplier,
  SupplierResponse,
  SupplierRequest,
  SearchSupplierRequest,
  PageResponse
} from '../models/supplier.model';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private readonly API_ENDPOINT = '/private/api/v1/suppliers';

  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  /* ================= SEARCH ================= */

  getSupplierPage(
    request?: SearchSupplierRequest
  ): Observable<PageResponse<Supplier>> {

    const searchRequest: SearchSupplierRequest = request || {
      page: 0,
      size: 10,
      sortBy: 'createdAt',
      sortDir: 'desc'
    };

    // Add shopId from token to payload
    searchRequest.shopId = this.authService.shopId || undefined;

    return this.apiService
      .post<PageResponse<SupplierResponse>>(
        `${this.API_ENDPOINT}/search`,
        searchRequest
      )
      .pipe(map(res => this.transformPageResponse(res)));
  }

  /* ================= CRUD ================= */

  addSupplier(data: Partial<Supplier>): Observable<Supplier> {

    const request: SupplierRequest = {
      supplierName: data.supplierName!,
      code: data.code!,
      phoneNumber: data.phoneNumber!,
      email: data.email,
      website: data.website,
      taxCode: data.taxCode
    };

    return this.apiService
      .post<SupplierResponse>(this.API_ENDPOINT, request)
      .pipe(map(res => this.transformSupplier(res)));
  }

  updateSupplier(id: string, data: Partial<Supplier>): Observable<Supplier> {

    const request: SupplierRequest = {
      supplierName: data.supplierName!,
      code: data.code!,
      phoneNumber: data.phoneNumber!,
      email: data.email,
      website: data.website,
      taxCode: data.taxCode,
      createdBy: data.createdBy
    };

    return this.apiService
      .put<SupplierResponse>(`${this.API_ENDPOINT}/${id}`, request)
      .pipe(map(res => this.transformSupplier(res)));
  }

  getSupplierById(id: string): Observable<Supplier> {
    return this.apiService
      .get<SupplierResponse>(`${this.API_ENDPOINT}/${id}`)
      .pipe(map(res => this.transformSupplier(res)));
  }

  deleteSupplier(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.API_ENDPOINT}/${id}`);
  }

  /* ================= TRANSFORM ================= */

  private transformSupplier(res: any): Supplier {
    return {
      id: res.id,
      supplierName: res.supplier_name ?? res.supplierName,
      code: res.code,
      phoneNumber: res.phone_number ?? res.phoneNumber,
      email: res.email,
      website: res.website,
      taxCode: res.tax_code ?? res.taxCode,
      createdAt: res.created_at,
      updatedAt: res.updated_at,
      createdBy: res.created_by,
      updatedBy: res.updated_by
    };
  }

  private transformPageResponse(res: any): PageResponse<Supplier> {
    return {
      content: res.content?.map((i: any) => this.transformSupplier(i)) || [],
      page: res.page_number ?? res.page ?? 0,
      size: res.page_size ?? res.size ?? 10,
      total: res.total_elements ?? res.totalElements ?? 0,
      totalPages: res.total_pages ?? res.totalPages ?? 0
    };
  }
}
