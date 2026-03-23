import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Customer,
  CustomerResponse,
  CustomerRequest,
  SearchCustomerRequest,
  PageResponse
} from '../models/customer.model';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly API_ENDPOINT = '/private/api/v1/customer';

  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  /* ================= GET ALL (FOR DROPDOWN) ================= */

  getAll(): Observable<Customer[]> {

    const request: SearchCustomerRequest = {
      page: 0,
      size: 1000,
      sortBy: 'createdAt',
      sortDir: 'desc',
      shopId: this.authService.shopId || undefined
    };

    return this.apiService
      .post<PageResponse<CustomerResponse>>(
        `${this.API_ENDPOINT}/search`,
        request
      )
      .pipe(
        map(res => res.content?.map((i: any) => this.transformCustomer(i)) || [])
      );
  }

  getCustomersByCurrentShop(): Observable<Customer[]> {

  const shopId = this.authService.shopId;

  if (!shopId) {
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  return this.apiService
    .get<CustomerResponse[]>(`${this.API_ENDPOINT}/by-shop/${shopId}`)
    .pipe(
      map(res => res.map(i => this.transformCustomer(i)))
    );
}
  /* ================= SEARCH ================= */

  getCustomerPage(
    request?: SearchCustomerRequest
  ): Observable<PageResponse<Customer>> {

    const searchRequest: SearchCustomerRequest = request || {
      page: 0,
      size: 10,
      sortBy: 'createdAt',
      sortDir: 'desc',
      shopId: this.authService.shopId || undefined
    };
    
    if (request && !request.shopId) {
      searchRequest.shopId = this.authService.shopId || undefined;
    }

    return this.apiService
      .post<PageResponse<CustomerResponse>>(
        `${this.API_ENDPOINT}/search`,
        searchRequest
      )
      .pipe(map(res => this.transformPageResponse(res)));
  }

  /* ================= CRUD ================= */

  addCustomer(data: Partial<Customer>): Observable<Customer> {

    const request: CustomerRequest = {
      fullName: data.fullName!,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      shopId: this.authService.shopId || undefined
    };

    return this.apiService
      .post<CustomerResponse>(this.API_ENDPOINT, request)
      .pipe(map(res => this.transformCustomer(res)));
  }

  updateCustomer(id: string, data: Partial<Customer>): Observable<Customer> {

    const request: CustomerRequest = {
      fullName: data.fullName!,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      shopId: this.authService.shopId || undefined,
      createdBy: data.createdBy // giữ giống Supplier
    };

    return this.apiService
      .put<CustomerResponse>(`${this.API_ENDPOINT}/${id}`, request)
      .pipe(map(res => this.transformCustomer(res)));
  }

  getCustomerById(id: string): Observable<Customer> {
    return this.apiService
      .get<CustomerResponse>(`${this.API_ENDPOINT}/${id}`)
      .pipe(map(res => this.transformCustomer(res)));
  }

  deleteCustomer(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.API_ENDPOINT}/${id}`);
  }

  /* ================= OPTIONAL (BY SHOP) ================= */

  getByShopId(shopId: string): Observable<Customer[]> {
    return this.apiService
      .get<CustomerResponse[]>(`${this.API_ENDPOINT}/by-shop/${shopId}`)
      .pipe(
        map(res => res.map(i => this.transformCustomer(i)))
      );
  }

  /* ================= TRANSFORM ================= */

  private transformCustomer(res: any): Customer {
    return {
      id: res.id,
      fullName: res.full_name ?? res.fullName,
      phoneNumber: res.phone_number ?? res.phoneNumber,
      email: res.email,
      address: res.address,
      shopId: res.shop_id ?? res.shopId,
      createdAt: res.created_at,
      updatedAt: res.updated_at,
      createdBy: res.created_by,
      updatedBy: res.updated_by
    };
  }

  private transformPageResponse(res: any): PageResponse<Customer> {
    return {
      content: res.content?.map((i: any) => this.transformCustomer(i)) || [],
      page: res.page_number ?? res.page ?? 0,
      size: res.page_size ?? res.size ?? 10,
      total: res.total_elements ?? res.totalElements ?? 0,
      totalPages: res.total_pages ?? res.totalPages ?? 0
    };
  }
}