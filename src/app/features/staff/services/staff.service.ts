import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Staff, StaffResponse, PageResponse, SearchStaffRequest } from '../models/staff.model';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private readonly API_ENDPOINT = '/private/api/v1/staffs';
  private staffList = new BehaviorSubject<Staff[]>([]);

  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  constructor() { }

  /**
   * Lấy danh sách nhân viên với tìm kiếm và phân trang
   */
  searchStaffList(request?: SearchStaffRequest): Observable<PageResponse<Staff>> {
    const searchRequest = request || {
      page: 0,
      size: 10,
      sortBy: 'createdAt',
      sortDir: 'desc'
    };

    return this.apiService.post<PageResponse<StaffResponse>>(
      `${this.API_ENDPOINT}/search`,
      searchRequest
    ).pipe(
      map(response => this.transformPageResponse(response))
    );
  }

  /**
   * Lấy danh sách tất cả nhân viên
   */
  getStaffList(): Observable<Staff[]> {
    return this.searchStaffList().pipe(
      map(response => response.content)
    );
  }

  /**
   * Thêm nhân viên mới
   */
  addStaff(staff: Partial<Staff>): Observable<Staff> {
    const request = {
      fullName: staff.fullName,
      email: staff.email,
      phoneNumber: staff.phoneNumber,
      createdBy: localStorage.getItem('username') // Lấy trực tiếp từ local storage
    };

    return this.apiService.post<StaffResponse>(
      this.API_ENDPOINT,
      request
    ).pipe(
      map(response => this.transformStaff(response))
    );
  }

  /**
   * Cập nhật nhân viên
   */
  updateStaff(staff: Staff): Observable<Staff> {
    const request = {
      fullName: staff.fullName,
      email: staff.email,
      phoneNumber: staff.phoneNumber,
      updatedBy: localStorage.getItem('username') // Lưu người thực hiện cập nhật
    };

    return this.apiService.put<StaffResponse>(
      `${this.API_ENDPOINT}/${staff.id}`,
      request
    ).pipe(
      map(response => this.transformStaff(response))
    );
  }

  /**
   * Xóa nhân viên
   */
  deleteStaff(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.API_ENDPOINT}/${id}`);
  }

  /**
   * Lấy thông tin nhân viên theo ID
   */
  getStaffById(id: string): Observable<Staff> {
    return this.apiService.get<StaffResponse>(
      `${this.API_ENDPOINT}/${id}`
    ).pipe(
      map(response => this.transformStaff(response))
    );
  }

  /**
   * Transform dữ liệu từ backend (snake_case) sang frontend (camelCase)
   */
  private transformStaff(response: any): Staff {
    return {
      id: response.id,
      fullName: response.full_name || response.fullName || '',
      email: response.email || '',
      phoneNumber: response.phone_number || response.phoneNumber || '',
      createdAt: response.created_at || response.createdAt,
      updatedAt: response.updated_at || response.updatedAt,
      createdBy: response.created_by || response.createdBy,
      updatedBy: response.updated_by || response.updatedBy
    };
  }

  /**
   * Transform page response từ backend
   */
  private transformPageResponse(response: any): PageResponse<Staff> {
    return {
      content: response.content ? response.content.map((item: any) => this.transformStaff(item)) : [],
      page: response.page_number || 0,
      size: response.page_size || 10,
      total: response.total_elements || 0,
      totalPages: response.total_pages || 0
    };
  }
}
