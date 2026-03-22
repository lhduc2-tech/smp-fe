// ================= COMMON =================
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// ================= PURCHASE ORDER =================
export interface PurchaseOrder {
  id: string;

  supplierId: string;
  supplierName?: string;
  status: string;
  note?: string;

  // ⚠️ map từ BE: purchase_order_items
  items: PurchaseOrderItem[];

  shopId?: string; // ✅ thêm

  createdAt?: string;
  createdBy?: string;

  updatedAt?: string;
  updatedBy?: string;
}

export interface PurchaseOrderResponse {
  id: string;

  supplier_id: string;
  status: string;
  note?: string;

  purchase_order_items: PurchaseOrderItemResponse[];

  shop_id: string;

  created_at?: string;
  created_by?: string;

  updated_at?: string;
  updated_by?: string;
}

export interface PurchaseOrderRequest {
  supplierId: string;
  note?: string;

  shopId?: string; // ✅ thêm

  createdBy?: string;
  updatedBy?: string;
}

export interface SearchPurchaseOrderRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';

  supplierId?: string;
  supplierName?: string;
  status?: string;

  shopId?: string; // ✅ thêm
}

// ================= PURCHASE ORDER ITEM =================
export interface PurchaseOrderItem {
  id?: string;

  purchaseOrderId?: string;

  productId: string;
  product_name?: string;

  quantity: number;
  importPrice?: number;
}

export interface PurchaseOrderItemResponse {
  id: string;

  purchase_order_id: string;
  product_id: string;
  product_name?: string;

  quantity: number;
  import_price?: number;
}

export interface PurchaseOrderItemRequest {
  productId: string;
  quantity: number;
  importPrice?: number;
}

// ✅ NEW: UPDATE DTO
export interface UpdatePurchaseOrderItemRequest {
  quantity: number;
  importPrice?: number;
}

// ================= STOCK MOVEMENT =================
export interface StockMovement {
  id: string;

  productId: string;
  productName?: string;
  shopId: string;

  movementType: 'IMPORT' | 'EXPORT';

  quantity: number;
  note?: string;

  createdAt?: string;
  createdBy?: string;

  updatedAt?: string;
  updatedBy?: string;
}

export interface SearchStockMovementRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';

  productId?: string;
  shopId?: string;
  movementType?: string;
}