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

  supplier_id: string;
  status: string;
  note?: string;

  purchaseOrderItems: PurchaseOrderItem[];

  created_at?: string;
  created_by?: string;

  updated_at?: string;
  updated_by?: string;
}

export interface PurchaseOrderRequest {
  supplierId: string;
  note?: string;

  createdBy?: string;
  updatedBy?: string;
}

export interface SearchPurchaseOrderRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';

  supplierId?: string;
  status?: string;
}

// ================= PURCHASE ORDER ITEM =================
export interface PurchaseOrderItem {
  id?: string;

  purchase_order_id?: string;

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

// ================= STOCK MOVEMENT =================
export interface StockMovement {
  id: string;

  product_id: string;
  shop_id: string;

  movement_type: 'IMPORT' | 'EXPORT';

  quantity: number;
  note?: string;

  created_at?: string;
  created_by?: string;

  updated_at?: string;
  updated_by?: string;
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