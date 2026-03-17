import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private baseUrl = '/api'; // chỉnh theo BE của bạn

  constructor(private http: HttpClient) {}

  // ================= PURCHASE ORDER =================

  createPurchaseOrder(request: PurchaseOrderRequest): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(
      `${this.baseUrl}/purchase-orders`,
      request
    );
  }

  searchPurchaseOrders(request: SearchPurchaseOrderRequest): Observable<PageResponse<PurchaseOrder>> {
    let params = new HttpParams()
      .set('page', request.page)
      .set('size', request.size);

    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    if (request.sortDir) params = params.set('sortDir', request.sortDir);
    if (request.supplierId) params = params.set('supplierId', request.supplierId);
    if (request.status) params = params.set('status', request.status);

    return this.http.get<PageResponse<PurchaseOrder>>(
      `${this.baseUrl}/purchase-orders`,
      { params }
    );
  }

  getPurchaseOrderById(id: string): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(
      `${this.baseUrl}/purchase-orders/${id}`
    );
  }

  addItemToPurchaseOrder(
    purchaseOrderId: string,
    request: PurchaseOrderItemRequest
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/purchase-orders/${purchaseOrderId}/items`,
      request
    );
  }

  confirmPurchaseOrder(id: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/purchase-orders/${id}/confirm`,
      {}
    );
  }

  // ================= STOCK MOVEMENT =================

  searchStockMovements(
    request: SearchStockMovementRequest
  ): Observable<PageResponse<StockMovement>> {

    let params = new HttpParams()
      .set('page', request.page)
      .set('size', request.size);

    if (request.sortBy) params = params.set('sortBy', request.sortBy);
    if (request.sortDir) params = params.set('sortDir', request.sortDir);
    if (request.productId) params = params.set('productId', request.productId);
    if (request.shopId) params = params.set('shopId', request.shopId);
    if (request.movementType) params = params.set('movementType', request.movementType);

    return this.http.get<PageResponse<StockMovement>>(
      `${this.baseUrl}/stock-movements`,
      { params }
    );
  }
}