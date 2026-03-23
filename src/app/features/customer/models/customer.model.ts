export interface Customer {
  id: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  shopId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
export interface CustomerResponse {
  id: string;
  full_name: string;
  phone_number?: string;
  email?: string;
  address?: string;
  shop_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  
}
export interface CustomerRequest {
  fullName: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  shopId?: string;
  createdBy?: string;
  updatedBy?: string;
}
export interface SearchCustomerRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  shopId?: string;
}
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}