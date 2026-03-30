import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

import {
  Inventory,
  SearchInventoryRequest,
  PageResponse,
  InventoryItemDto,
  SearchInventoryItemRequest,
  AdjustInventoryRequest
} from '../models/inventory.model';

import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  private readonly API_ENDPOINT = '/private/api/v1/inventories';

  /**
   * Lấy tồn kho theo shop (default)
   */
  getInventoryPage(request?: SearchInventoryRequest): Observable<PageResponse<Inventory>> {
    const shopId = this.authService.shopId;

    const searchRequest = {
      page: request?.page ?? 0,
      size: request?.size ?? 10,
      sortBy: request?.sortBy || 'updated_at',
      sortDir: request?.sortDir || 'desc',
      productId: request?.productId,
      shopId: request?.shopId || shopId
    };

    return this.apiService.get<PageResponse<any>>(
      this.API_ENDPOINT,
      { params: searchRequest }
    ).pipe(
      map(res => this.transformPageResponse(res))
    );
  }

  /**
   * Lấy tồn kho theo product + shop
   */
  getByProductAndShop(productId: string): Observable<Inventory> {
    const shopId = this.authService.shopId;

    if (!shopId) {
      throw new Error('Shop ID not found');
    }

    return this.apiService.get<any>(
      `${this.API_ENDPOINT}/${productId}/${shopId}`
    ).pipe(
      map(res => this.transformInventory(res))
    );
  }

  /**
   * Lấy tồn kho cho kho (shop) hiện tại
   */
  getInventoryForShop(
    request: SearchInventoryItemRequest
  ): Observable<PageResponse<InventoryItemDto>> {
    const body = {
      page: request.page ?? 0,
      size: request.size ?? 10,
      sortBy: request.sortBy || 'updatedAt',
      sortDir: request.sortDir || 'desc',
      searchQuery: request.searchQuery || ''
    };

    return this.apiService.post<any>(
      `${this.API_ENDPOINT}/shop`,
      body
    ).pipe(
      map(res => this.transformInventoryShopResponse(res))
    );
  }

  /**
   * Điều chỉnh số lượng tồn kho theo sản phẩm
   */
  adjustStock(productId: string, request: AdjustInventoryRequest): Observable<any> {
    return this.apiService.put<any>(
      `${this.API_ENDPOINT}/${productId}/adjust`,
      request
    );
  }

  // ================= TRANSFORM =================

  private transformInventory(res: any): Inventory {
    return {
      product_id: res.product_id,
      product_name: res.product_name,
      shop_id: res.shop_id,
      quantity: res.quantity,
      updated_at: res.updated_at
    };
  }

  private transformPageResponse(res: any): PageResponse<Inventory> {
    return {
      content: res.content?.map((i: any) => this.transformInventory(i)) || [],
      page: res.page_number || 0,
      size: res.page_size || 10,
      total: res.total_elements || 0,
      totalPages: res.total_pages || 0
    };
  }

  private transformInventoryShopItem(res: any): InventoryItemDto {
    return {
      product_id: res.product_id || res.productId,
      product_code: res.product_code || res.productCode,
      product_name: res.product_name || res.productName,
      category_name: res.category_name || res.categoryName,
      quantity: res.quantity,
      updated_at: res.updated_at || res.updatedAt
    };
  }

  private transformInventoryShopResponse(res: any): PageResponse<InventoryItemDto> {
    const data = res.data || res;
    return {
      content: data.content?.map((i: any) => this.transformInventoryShopItem(i)) || [],
      page: data.page_number ?? data.page ?? 0,
      size: data.page_size ?? data.size ?? 10,
      total: data.total_elements ?? data.totalElements ?? 0,
      totalPages: data.total_pages ?? data.totalPages ?? 0
    };
  }
}