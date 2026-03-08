export interface Permission {
  id: string;
  code: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionResponse {
  id: string;
  code: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PermissionRequest {
  code: string;
  description?: string;
}

export interface SearchPermissionRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  code?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}