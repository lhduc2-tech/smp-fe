export interface Inventory {
  product_id: string;
  product_name?: string;
  shop_id: string;
  quantity: number;
  updated_at?: string;
}
export interface SearchInventoryRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';

  productId?: string;
  shopId?: string;
}
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface InventoryItemDto {
  product_id: string;
  product_code: string;
  product_name: string;
  category_name: string;
  quantity: number;
  updated_at: string;
}

export interface SearchInventoryItemRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  searchQuery?: string;
}