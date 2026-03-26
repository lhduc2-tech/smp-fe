export interface OrderItem {
    id: string;
    quantity: number;
    productId: string;
    orderId: string;
    totalPrice: number;
    unitPrice: number;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface OrderItemResponse {
    id: string;
    quantity: number;
    product_id: string;
    order_id: string;
    total_price: number;
    unit_price: number;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    updated_by?: string;
}

export interface Order {
    id: string;
    price: number;
    orderItems: OrderItem[];
    orderDate: string;
    customerId?: string;
    customerName: string;
    orderOrigin: string;
    paymentState: string;
    processState: string;
    deliveryService: string;
    shopId: string | null;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updatedBy?: string;
    orderName: string;
    description?: string;
    shop?: any;
    customer?: any;
}

export interface OrderResponse {
    id: string;
    price: number;
    order_items: OrderItemResponse[];
    order_date: string;
    customer_id?: string;
    customer_name: string;
    order_origin: string;
    payment_state: string;
    process_state: string;
    delivery_service: string;
    shop_id: string | null;
    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
    order_name: string;
    description?: string;
}

export interface SearchOrderRequest {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    customerName?: string;
    shopId?: string;
}

export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    total: number;
    totalPages: number;
}

export interface OrderItemRequest {
    productId: string;
    quantity: number;
    orderId?: string;
    totalPrice?: number;
    unitPrice?: number;
    createdBy?: string;
    updatedBy?: string;
}

export interface CreateOrderRequest {
    orderDate: string;
    customerId?: string;
    orderOrigin: string;
    price: number;
    paymentState: string;
    processState: string;
    deliveryService: string;
    shopId: string;
    createdBy: string;
    updatedBy: string;
    paymentMethod: string;
    description?: string;
    orderItems: OrderItemRequest[];
}

export interface UpdateOrderRequest {
    orderDate: string;
    customerId?: string;
    orderOrigin: string;
    price: number;
    paymentState: string;
    processState: string;
    deliveryService: string;
    shopId?: string;
    createdBy?: string;
    updatedBy?: string;
    paymentMethod?: string;
    description?: string;
    orderItems?: OrderItemRequest[];
}

