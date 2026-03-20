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
  status: string;
  note?: string;

  items: PurchaseOrderItem[];

  createdAt?: string;
  createdBy?: string;

  updatedAt?: string;
  updatedBy?: string;
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

  purchaseOrderId?: string;

  productId: string;
  productName?: string;

  quantity: number;
  importPrice?: number;
}

export interface PurchaseOrderItemRequest {
  productId: string;
  quantity: number;
  importPrice?: number;
}

// ================= STOCK MOVEMENT =================
export interface StockMovement {
  id: string;

  productId: string;
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