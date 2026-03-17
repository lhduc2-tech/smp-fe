import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

import {
  Inventory,
  SearchInventoryRequest,
  PageResponse
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
}