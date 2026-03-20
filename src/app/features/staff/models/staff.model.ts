export interface Staff {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position?: string;
  status?: string;
  shopId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface StaffResponse {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  status?: string;
  position?: string;
  shop_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface SearchStaffRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  status?: string;
  position?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  shopId?: string;
}
