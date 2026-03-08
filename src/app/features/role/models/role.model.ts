export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleResponse {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleRequest {
  code: string;
  name: string;
  description?: string;
  status?: string;
}

export interface SearchRoleRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  code?: string;
  name?: string;
  status?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}