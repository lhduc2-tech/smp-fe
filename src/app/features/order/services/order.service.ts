import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
    Order,
    OrderResponse,
    SearchOrderRequest,
    PageResponse,
    OrderItem,
    OrderItemResponse,
    CreateOrderRequest,
    UpdateOrderRequest
} from '../models/order.model';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private readonly API_ENDPOINT = '/private/api/v1/order';

    private apiService = inject(ApiService);
    private authService = inject(AuthService);

    /* ================= SEARCH ================= */

    searchOrders(
        request?: SearchOrderRequest
    ): Observable<PageResponse<Order>> {

        const shopId = this.authService.shopId;

        const searchRequest: SearchOrderRequest = request || {
            page: 0,
            size: 10,
            sortBy: 'createdAt',
            sortDir: 'desc'
        };

        // Thêm shopId từ token vào request
        if (shopId) {
            searchRequest.shopId = shopId;
        }

        return this.apiService
            .post<PageResponse<OrderResponse>>(
                `${this.API_ENDPOINT}/search`,
                searchRequest
            )
            .pipe(map(res => this.transformPageResponse(res)));
    }

    /* ================= CREATE ================= */

    createOrder(request: CreateOrderRequest): Observable<Order> {
        return this.apiService
            .post<OrderResponse>(this.API_ENDPOINT, request)
            .pipe(map(res => this.transformOrder(res)));
    }

    /* ================= DELETE ================= */

    deleteOrder(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.API_ENDPOINT}/${id}`);
    }
    /* ================= GET BY ID ================= */

    getOrderById(id: string): Observable<Order> {
    return this.apiService
        .get<OrderResponse>(`${this.API_ENDPOINT}/${id}`)
        .pipe(map(res => this.transformOrder(res)));
    }

    /* ================= UPDATE ORDER ================= */

    updateOrder(id: string, request: UpdateOrderRequest): Observable<Order> {
        return this.apiService
            .put<OrderResponse>(`${this.API_ENDPOINT}/${id}`, request)
            .pipe(map(res => this.transformOrder(res)));
    }
    /* ================= TRANSFORM ================= */

    private transformOrderItem(res: any): OrderItem {
        return {
            id: res.id,
            quantity: res.quantity,
            productId: res.product_id ?? res.productId,
            orderId: res.order_id ?? res.orderId,
            totalPrice: res.total_price ?? res.totalPrice,
            unitPrice: res.unit_price ?? res.unitPrice,
            createdAt: res.created_at,
            createdBy: res.created_by,
            updatedAt: res.updated_at,
            updatedBy: res.updated_by
        };
    }

    private transformOrder(res: any): Order {
        return {
            id: res.id,
            price: res.price,
            orderItems: res.order_items?.map((item: any) => this.transformOrderItem(item)) || [],
            orderDate: res.order_date ?? res.orderDate,
            customerId: res.customer_id ?? res.customerId,
            customerName: res.customer_name ?? res.customerName,
            orderOrigin: res.order_origin ?? res.orderOrigin,
            paymentState: res.payment_state ?? res.paymentState,
            processState: res.process_state ?? res.processState,
            deliveryService: res.delivery_service ?? res.deliveryService,
            shopId: res.shop_id ?? res.shopId,
            createdAt: res.created_at,
            createdBy: res.created_by,
            updatedAt: res.updated_at,
            updatedBy: res.updated_by,
            orderName: res.order_name ?? res.orderName,
            description: res.description
        };
    }

    private transformPageResponse(res: any): PageResponse<Order> {
        return {
            content: res.content?.map((i: any) => this.transformOrder(i)) || [],
            page: res.page_number ?? res.page ?? 0,
            size: res.page_size ?? res.size ?? 10,
            total: res.total_elements ?? res.totalElements ?? 0,
            totalPages: res.total_pages ?? res.totalPages ?? 0
        };
    }
}
