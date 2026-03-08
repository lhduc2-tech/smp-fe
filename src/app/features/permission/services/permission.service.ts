import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Permission,
  PermissionRequest,
  PermissionResponse
} from '../models/permission.model';

import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private readonly API_ENDPOINT = '/private/api/v1/permissions';

  private apiService = inject(ApiService);

  /* ================= GET ALL ================= */

  getAllPermissions(): Observable<Permission[]> {
    return this.apiService
      .get<PermissionResponse[]>(this.API_ENDPOINT)
      .pipe(map(res => res.map(item => this.transformPermission(item))));
  }

  /* ================= GET BY ID ================= */

  getPermissionById(id: string): Observable<Permission> {
    return this.apiService
      .get<PermissionResponse>(`${this.API_ENDPOINT}/${id}`)
      .pipe(map(res => this.transformPermission(res)));
  }

  /* ================= CREATE ================= */

  createPermission(data: PermissionRequest): Observable<Permission> {
    return this.apiService
      .post<PermissionResponse>(this.API_ENDPOINT, data)
      .pipe(map(res => this.transformPermission(res)));
  }

  /* ================= UPDATE ================= */

  updatePermission(
    id: string,
    data: PermissionRequest
  ): Observable<Permission> {
    return this.apiService
      .put<PermissionResponse>(`${this.API_ENDPOINT}/${id}`, data)
      .pipe(map(res => this.transformPermission(res)));
  }

  /* ================= DELETE ================= */

  deletePermission(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.API_ENDPOINT}/${id}`);
  }

  /* ================= TRANSFORM ================= */

  private transformPermission(res: any): Permission {
    return {
      id: res.id,
      code: res.code,
      description: res.description,
      createdAt: res.created_at ?? res.createdAt,
      updatedAt: res.updated_at ?? res.updatedAt
    };
  }
}