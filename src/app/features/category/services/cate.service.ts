import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Category,
  CategoryResponse,
  SearchCategoryRequest,
  PageResponse
} from '../models/cate.model';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly API_ENDPOINT = '/private/api/v1/category';

  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  /* ================= SEARCH ================= */

  getCategoryPage(
    request?: SearchCategoryRequest
  ): Observable<PageResponse<Category>> {

    const searchRequest: SearchCategoryRequest = request || {
      page: 0,
      size: 10,
      sortBy: 'createdAt',
      sortDir: 'desc'
    };

    return this.apiService
      .post<PageResponse<CategoryResponse>>(
        `${this.API_ENDPOINT}/search`,
        searchRequest
      )
      .pipe(map(res => this.transformPageResponse(res)));
  }

  /* ================= CRUD ================= */

  addCategory(data: Partial<Category>): Observable<Category> {
    const request = {
      categoryName: data.categoryName,
      categoryDescription: data.categoryDescription,
      createdBy: this.authService.username
    };

    return this.apiService
      .post<CategoryResponse>(this.API_ENDPOINT, request)
      .pipe(map(res => this.transformCategory(res)));
  }

  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    const request = {
      categoryName: data.categoryName,
      categoryDescription: data.categoryDescription,
      updatedBy: this.authService.username
    };

    return this.apiService
      .put<CategoryResponse>(`${this.API_ENDPOINT}/${id}`, request)
      .pipe(map(res => this.transformCategory(res)));
  }

  getCategoryById(id: string): Observable<Category> {
    return this.apiService
      .get<CategoryResponse>(`${this.API_ENDPOINT}/${id}`)
      .pipe(map(res => this.transformCategory(res)));
  }

  deleteCategory(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.API_ENDPOINT}/${id}`);
  }

  /* ================= TRANSFORM ================= */

  private transformCategory(res: any): Category {
    return {
      id: res.id,
      categoryName: res.category_name ?? res.categoryName,
      categoryDescription: res.category_description ?? res.categoryDescription,
      createdAt: res.created_at,
      createdBy: res.created_by,
      updatedAt: res.updated_at,
      updatedBy: res.updated_by
    };
  }

  private transformPageResponse(res: any): PageResponse<Category> {
    return {
      content: res.content?.map((i: any) => this.transformCategory(i)) || [],
      page: res.page_number ?? res.page ?? 0,
      size: res.page_size ?? res.size ?? 10,
      total: res.total_elements ?? res.totalElements ?? 0,
      totalPages: res.total_pages ?? res.totalPages ?? 0
    };
  }
}
