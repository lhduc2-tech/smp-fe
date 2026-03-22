import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

import {
  PurchaseOrder,
  PurchaseOrderRequest,
  PurchaseOrderItemRequest,
  SearchPurchaseOrderRequest,
  StockMovement,
  SearchStockMovementRequest,
  PageResponse
} from '../models/inventory-flow.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryFlowService {

  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  private readonly API_PO = '/private/api/v1/purchase-orders';
  private readonly API_SM = '/private/api/v1/stock-movements';

  // ================= PURCHASE ORDER =================

  // ✅ FIX: return UUID
  createPurchaseOrder(request: PurchaseOrderRequest): Observable<string> {
    const payload = {
      ...request,
      shopId: this.authService.shopId ?? undefined,
      createdBy: this.authService.username ?? undefined
    };

    return this.apiService.post<string>(this.API_PO, payload);
  }

  searchPurchaseOrders(
    request?: SearchPurchaseOrderRequest
  ): Observable<PageResponse<PurchaseOrder>> {

    const body = {
      page: request?.page ?? 0,
      size: request?.size ?? 10,
      sortBy: request?.sortBy ?? 'createdAt',
      sortDir: request?.sortDir ?? 'desc',

      supplierId: request?.supplierId,
      supplierName: request?.supplierName,
      status: request?.status,

      shopId: this.authService.shopId ?? undefined
    };

    return this.apiService.post<any>(`${this.API_PO}/search`, body)
      .pipe(map(res => this.transformPOPage(res)));
  }

  getPurchaseOrderById(id: string): Observable<PurchaseOrder> {
    return this.apiService.get<any>(`${this.API_PO}/${id}`)
      .pipe(map(res => this.transformPurchaseOrder(res)));
  }

  addItemToPurchaseOrder(
    purchaseOrderId: string,
    request: PurchaseOrderItemRequest
  ): Observable<void> {
    return this.apiService.post<void>(
      `${this.API_PO}/${purchaseOrderId}/items`,
      request
    );
  }

  // ✅ NEW: UPDATE ITEM
  updateItem(itemId: string, request: any): Observable<void> {
    return this.apiService.put<void>(
      `${this.API_PO}/items/${itemId}`,
      request
    );
  }

  // ✅ NEW: DELETE ITEM
  deleteItem(itemId: string): Observable<void> {
    return this.apiService.delete<void>(
      `${this.API_PO}/items/${itemId}`
    );
  }

  // ✅ FIX: không cần body nếu BE không dùng
  confirmPurchaseOrder(id: string): Observable<void> {
    return this.apiService.post<void>(
      `${this.API_PO}/${id}/confirm`,
      {}
    );
  }

  // ================= STOCK MOVEMENT =================

  searchStockMovements(
    request?: SearchStockMovementRequest
  ): Observable<PageResponse<StockMovement>> {

    const body = {
      page: request?.page ?? 0,
      size: request?.size ?? 10,
      sortBy: request?.sortBy ?? 'createdAt',
      sortDir: request?.sortDir ?? 'desc',

      productId: request?.productId,
      movementType: request?.movementType,

      shopId: request?.shopId ?? this.authService.shopId ?? undefined
    };

    return this.apiService.post<any>(`${this.API_SM}/search`, body)
      .pipe(map(res => this.transformSMPage(res)));
  }

  // ================= TRANSFORM =================

  private transformPurchaseOrder(res: any): PurchaseOrder {
    return {
      id: res.id,
      supplierId: res.supplier_id ?? res.supplierId,
      supplierName: res.supplierName,
      status: res.status,
      note: res.note,
      shopId: res.shop_id,

      // ✅ FIX FIELD
      items: res.purchase_order_items?.map((i: any) => ({
        id: i.id,
        purchaseOrderId: i.purchase_order_id,
        productId: i.product_id,
        productName: i.product_name,
        quantity: i.quantity,
        importPrice: i.import_price
      })) || [],

      createdAt: res.created_at,
      updatedAt: res.updated_at,
      createdBy: res.created_by,
      updatedBy: res.updated_by
    };
  }

  private transformStockMovement(res: any): StockMovement {
    return {
      id: res.id,
      productId: res.product_id,
      productName: res.product_name,
      shopId: res.shop_id,
      movementType: res.movement_type,
      quantity: res.quantity,
      note: res.note,

      createdAt: res.created_at,
      createdBy: res.created_by,
      updatedAt: res.updated_at,
      updatedBy: res.updated_by
    };
  }

  private transformPOPage(res: any): PageResponse<PurchaseOrder> {
    return {
      content: res.content?.map((i: any) => this.transformPurchaseOrder(i)) || [],
      page: res.page_number ?? res.page ?? 0,
      size: res.page_size ?? res.size ?? 10,
      total: res.total_elements ?? res.totalElements ?? 0,
      totalPages: res.total_pages ?? res.totalPages ?? 0
    };
  }

  private transformSMPage(res: any): PageResponse<StockMovement> {
    return {
      content: res.content?.map((i: any) => this.transformStockMovement(i)) || [],
      page: res.page_number ?? res.page ?? 0,
      size: res.page_size ?? res.size ?? 10,
      total: res.total_elements ?? res.totalElements ?? 0,
      totalPages: res.total_pages ?? res.totalPages ?? 0
    };
  }
}