import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Role,
  RoleRequest,
  RoleResponse,
  SearchRoleRequest,
  PageResponse
} from '../models/role.model';

import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private readonly API_ENDPOINT = '/private/api/v1/roles';

  private apiService = inject(ApiService);

  /* ================= SEARCH ================= */

  searchRoles(request: SearchRoleRequest): Observable<PageResponse<Role>> {
    return this.apiService
      .post<PageResponse<RoleResponse>>(`${this.API_ENDPOINT}/search`, request)
      .pipe(
        map(res => ({
          ...res,
          content: res.content.map(r => this.transformRole(r))
        }))
      );
  }

  /* ================= GET BY ID ================= */

  getRoleById(id: string): Observable<Role> {
    return this.apiService
      .get<RoleResponse>(`${this.API_ENDPOINT}/${id}`)
      .pipe(map(res => this.transformRole(res)));
  }

  /* ================= CREATE ================= */

  createRole(data: RoleRequest): Observable<Role> {
    return this.apiService
      .post<RoleResponse>(this.API_ENDPOINT, data)
      .pipe(map(res => this.transformRole(res)));
  }

  /* ================= UPDATE ================= */

  updateRole(id: string, data: RoleRequest): Observable<Role> {
    return this.apiService
      .put<RoleResponse>(`${this.API_ENDPOINT}/${id}`, data)
      .pipe(map(res => this.transformRole(res)));
  }

  /* ================= DELETE ================= */

  deleteRole(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.API_ENDPOINT}/${id}`);
  }

  /* ================= ASSIGN PERMISSIONS ================= */

  assignPermissions(
    roleId: string,
    permissionIds: string[]
  ): Observable<void> {
    return this.apiService.post<void>(
      `${this.API_ENDPOINT}/${roleId}/permissions`,
      { permissionIds }
    );
  }

  /* ================= TRANSFORM ================= */

  private transformRole(res: RoleResponse): Role {
    return {
      id: res.id,
      code: res.code,
      name: res.name,
      description: res.description,
      status: res.status,
      permissions: res.permissions,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt
    };
  }
}