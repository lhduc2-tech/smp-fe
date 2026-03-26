import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { StaffDashboard } from '../../models/dashboard.model';
import { LucideAngularModule, ShoppingBag, Clock, CheckCircle, XCircle, DollarSign, AlertTriangle, Package, Loader2, AlertCircle } from 'lucide-angular';
import { RouterModule, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-staff',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './dashboard-staff.component.html',
  styleUrls: ['./dashboard-staff.component.css']
})
export class StaffDashboardComponent implements OnInit {
  dashboardData: StaffDashboard | null = null;
  loading = true;
  error: string | null = null;

  // Icons
  readonly ShoppingBag = ShoppingBag;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly DollarSign = DollarSign;
  readonly AlertTriangle = AlertTriangle;
  readonly Package = Package;
  readonly Loader2 = Loader2;
  readonly AlertCircle = AlertCircle;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.getStaffDashboard().subscribe({
      next: (data) => {
        if (!data || Object.keys(data).length === 0) {
           this.error = 'Dữ liệu trả về bị rỗng';
           this.loading = false;
           this.cdr.detectChanges();
           return;
        }
        this.dashboardData = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.error = 'Không thể tải dữ liệu bảng điều khiển';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  importProduct(productId: string): void {
    this.router.navigate(['/inventory/purchase-orders/create'], {
      queryParams: { productId }
    });
  }
}
