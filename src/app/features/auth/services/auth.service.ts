import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { RegisterRequest, RegisterResponse } from '../models/auth.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL =
    'http://localhost:8082/sales/public/api/v1/auth';

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/login`, request)
      .pipe(
        tap(res => {
          // Token
          localStorage.setItem('access_token', res.access_token);

          // User info
          localStorage.setItem('username', res.username);
          localStorage.setItem('user_id', res.user_id);

          // Authorization
          localStorage.setItem('roles', JSON.stringify(res.roles));
          localStorage.setItem('permissions', JSON.stringify(res.permissions));
        })
      );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.API_URL}/register`,
      request
    );
  }
  loginWithGoogle(idToken: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/google`, {
        idToken: idToken
      })
      .pipe(
        tap((res: LoginResponse) => {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('user_id', res.user_id);
          localStorage.setItem('roles', JSON.stringify(res.roles));
          localStorage.setItem('permissions', JSON.stringify(res.permissions));
        })
      );
  }
  logout(): void {
    // 1. Xóa sạch dữ liệu ngay lập tức (đồng bộ) để UI và Guards cập nhật kịp thời
    this.clearUserData();

    // 2. Gọi API logout để blacklist token phía server (Fire and forget)
    // Lưu ý: Nếu interceptor của bạn lấy token từ localStorage, bạn có thể cần lấy token ra biến tạm trước khi xóa
    this.http.post(`${this.API_URL}/logout`, {}).subscribe();
  }

  private clearUserData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('roles');
    localStorage.removeItem('permissions');
  }
  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  get roles(): string[] {
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }

  get permissions(): string[] {
    return JSON.parse(localStorage.getItem('permissions') || '[]');
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
