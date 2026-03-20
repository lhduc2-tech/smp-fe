export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  shopId?: string;
  category_name?: string;
  categoryId?: string;

  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ProductResponse {
  id: string;
  code: string;
  name: string;
  price: number;
  shop_id?: string;

  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  category_id?: string;
  category_name?: string;
}
export interface SearchProductRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';

  code?: string;
  name?: string;
  shopId?: string;
  searchQuery?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}