// Model dùng trong FE (camelCase)
export interface Supplier {
  id: string;
  supplierName: string;
  code: string;
  phoneNumber: string;
  email?: string;
  website?: string;
  taxCode?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// Response nhận từ BE (snake_case theo @JsonProperty)
export interface SupplierResponse {
  id: string;
  supplier_name: string;
  code: string;
  phone_number: string;
  email?: string;
  website?: string;
  tax_code?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

// Request gửi lên BE (theo SupplierRequest.java)
export interface SupplierRequest {
  supplierName: string;
  code?: string;
  phoneNumber: string;
  email?: string;
  website?: string;
  taxCode?: string;
  createdBy?: string;
  updatedBy?: string;
  shopId?: string;
}

// Search & Paging
export interface SearchSupplierRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  supplierName?: string;
  code?: string;
  phoneNumber?: string;
  shopId?: string;
}

// Generic Page Response (giữ nguyên mẫu bạn đang dùng)
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
