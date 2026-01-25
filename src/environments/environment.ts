/**
 * Environment Configuration
 * Chỉnh sửa file này để thay đổi Base URL hoặc các config khác
 */

export const environment = {
  // Backend API Configuration
  api: {
    baseUrl: 'http://localhost:8082',
    contextPath: '/sales',
    version: 'api/v1'
  },

  // Staff API Endpoints
  staffApi: {
    basePath: '/private/api/v1/staffs'
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    defaultSortBy: 'createdAt',
    defaultSortDir: 'desc'
  }
};

/**
 * Helper function để build full URL
 */
export function getApiUrl(endpoint: string): string {
  return `${environment.api.baseUrl}${environment.api.contextPath}${endpoint}`;
}
