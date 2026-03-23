import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { AdminDashboard } from '../../models/dashboard.model';
import { LucideAngularModule, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, AlertTriangle, Star, AlertCircle, TrendingUp as TrendingUpIcon, Loader2 } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class OwnerDashboardComponent implements OnInit {
  dashboardData: AdminDashboard | null = null;
  loading = true;
  error: string | null = null;
  
  // Icons
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly DollarSign = DollarSign;
  readonly Package = Package;
  readonly ShoppingCart = ShoppingCart;
  readonly AlertTriangle = AlertTriangle;
  readonly Star = Star;
  readonly AlertCircle = AlertCircle;
  readonly TrendingUpIcon = TrendingUpIcon;
  readonly Loader2 = Loader2;

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDashboardData('all');
  }

  onPeriodChange(event: any): void {
    const period = event.target.value;
    this.loadDashboardData(period);
  }

  private loadDashboardData(period: string): void {
    this.loading = true;
    this.error = null;
    this.dashboardService.getAdminDashboard(period).subscribe({
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
}
