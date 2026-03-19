import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

import {
  Product,
  ProductResponse,
  PageResponse,
  SearchProductRequest
} from '../models/product.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private authService = inject(AuthService);
  private readonly API_ENDPOINT = '/private/api/v1/products';
  private apiService = inject(ApiService);

  /**
   * Lấy tất cả sản phẩm của shop hiện tại
   */
  getAllProductByShopId(): Observable<Product[]> {
    const shopId = this.authService.shopId;
    if (!shopId) {
      throw new Error('Shop ID not found');
    }
    return this.apiService.get<ProductResponse[]>(
      `${this.API_ENDPOINT}/all-by-shop/${shopId}`
    ).pipe(
      map(res => res.map(item => this.transformProduct(item)))
    );
  }

  /**
   * Phân trang + tìm kiếm
   */
  getProductPage(request?: SearchProductRequest): Observable<PageResponse<Product>> {
    const searchRequest = request || {
      page: 0,
      size: 10,
      sortBy: 'createdAt',
      sortDir: 'desc'
    };

    return this.apiService.post<PageResponse<ProductResponse>>(
      `${this.API_ENDPOINT}/search`,
      searchRequest
    ).pipe(
      map(res => this.transformPageResponse(res))
    );
  }

  /**
   * Thêm sản phẩm
   */
  addProduct(product: Partial<Product>): Observable<Product> {
    const request = {
      code: product.code,
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      shopId: this.authService.shopId,
      createdBy: this.authService.username
    };

    return this.apiService.post<ProductResponse>(
      this.API_ENDPOINT,
      request
    ).pipe(
      map(res => this.transformProduct(res))
    );
  }


  /**
   * Cập nhật sản phẩm
   */
  updateProduct(product: Product): Observable<Product> {
    const request = {
      code: product.code,
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      shopId: this.authService.shopId,
      updatedBy: this.authService.username
    };

    return this.apiService.put<ProductResponse>(
      `${this.API_ENDPOINT}/${product.id}`,
      request
    ).pipe(
      map(res => this.transformProduct(res))
    );
  }


  /**
   * Xóa
   */
  deleteProduct(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.API_ENDPOINT}/${id}`);
  }

  /**
   * Lấy theo ID
   */
  getProductById(id: string): Observable<Product> {
    return this.apiService.get<ProductResponse>(
      `${this.API_ENDPOINT}/${id}`
    ).pipe(
      map(res => this.transformProduct(res))
    );
  }

  // ================= TRANSFORM =================

  private transformProduct(res: any): Product {
    return {
      id: res.id,
      code: res.code,
      name: res.name,
      price: res.price,
      shopId: res.shop_id || res.shopId,
      category_name: res.category_name || res.categoryName,
      createdAt: res.created_at,
      updatedAt: res.updated_at,
      createdBy: res.created_by,
      updatedBy: res.updated_by,
      categoryId: res.category_id || res.categoryId
    };
  }

  private transformPageResponse(res: any): PageResponse<Product> {
    return {
      content: res.content?.map((i: any) => this.transformProduct(i)) || [],
      page: res.page_number || 0,
      size: res.page_size || 10,
      total: res.total_elements || 0,
      totalPages: res.total_pages || 0
    };
  }
}
