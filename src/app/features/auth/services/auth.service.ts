import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '../models/auth.model';

import { JwtPayload } from '../../../core/models/jwt-payload.model';

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
          // 1. Lưu token
          localStorage.setItem('access_token', res.access_token);

          // 2. Decode JWT
          const payload = jwtDecode<JwtPayload>(res.access_token);

          // 3. Lưu thông tin user từ JWT
          localStorage.setItem('username', payload.sub);
          localStorage.setItem('user_id', payload.userId);
          localStorage.setItem('shop_id', payload.shopId);

          // 4. Lưu role & permission từ JWT
          localStorage.setItem('roles', JSON.stringify(payload.roles));
          localStorage.setItem('permissions', JSON.stringify(payload.permissions));
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
      .post<LoginResponse>(`${this.API_URL}/google`, { idToken })
      .pipe(
        tap(res => {
          localStorage.setItem('access_token', res.access_token);

          const payload = jwtDecode<JwtPayload>(res.access_token);

          localStorage.setItem('username', payload.sub);
          localStorage.setItem('user_id', payload.userId);
          localStorage.setItem('shop_id', payload.shopId);

          localStorage.setItem('roles', JSON.stringify(payload.roles));
          localStorage.setItem('permissions', JSON.stringify(payload.permissions));
        })
      );
  }

  logout(): void {
    this.clearUserData();
    this.http.post(`${this.API_URL}/logout`, {}).subscribe();
  }

  private clearUserData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('shop_id');
    localStorage.removeItem('roles');
    localStorage.removeItem('permissions');
  }

  // ===== GETTERS =====

  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  get username(): string | null {
    return localStorage.getItem('username');
  }

  get userId(): string | null {
    return localStorage.getItem('user_id');
  }

  get shopId(): string | null {
    return localStorage.getItem('shop_id');
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
