import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminDashboard, StaffDashboard } from '../models/dashboard.model';
import { environment, getApiUrl } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getAdminDashboard(period: string = 'all'): Observable<AdminDashboard> {
    const params = new HttpParams().set('period', period);
    return this.http.get<AdminDashboard>(getApiUrl('/private/api/v1/dashboard/admin'), { params });
  }

  getStaffDashboard(): Observable<StaffDashboard> {
    return this.http.get<StaffDashboard>(getApiUrl('/private/api/v1/dashboard/staff'));
  }
}
