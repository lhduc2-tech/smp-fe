import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Staff, StaffResponse, PageResponse, SearchStaffRequest } from '../models/staff.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private readonly API_ENDPOINT = '/private/api/v1/staffs';
  private staffList = new BehaviorSubject<Staff[]>([]);

  constructor(private apiService: ApiService) {}

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
      phoneNumber: staff.phoneNumber
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
      phoneNumber: staff.phoneNumber
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
  private transformStaff(response: StaffResponse): Staff {
    return {
      id: response.id,
      fullName: response.full_name,
      email: response.email,
      phoneNumber: response.phone_number,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      createdBy: response.created_by,
      updatedBy: response.updated_by
    };
  }

  /**
   * Transform page response từ backend
   */
  private transformPageResponse(response: PageResponse<StaffResponse>): PageResponse<Staff> {
    return {
      content: response.content.map(item => this.transformStaff(item)),
      page: response.page,
      size: response.size,
      total: response.total,
      totalPages: response.totalPages
    };
  }
}
