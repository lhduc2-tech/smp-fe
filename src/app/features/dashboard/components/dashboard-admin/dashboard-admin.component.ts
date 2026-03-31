import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboard } from '../../models/dashboard.model';
import { LucideAngularModule, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, AlertTriangle, Star, AlertCircle, TrendingUp as TrendingUpIcon, Loader2 } from 'lucide-angular';
import { RouterModule, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
// 1. Import Chart.js
import { Chart, registerables } from 'chart.js';

// 2. Đăng ký các thành phần của Chart.js
Chart.register(...registerables);

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
  
  // 3. Khai báo biến chart
  chart: any;

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

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

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
        
        // Cập nhật giao diện trước khi render chart
        this.cdr.detectChanges();
        
        // 4. Gọi hàm vẽ biểu đồ
        this.renderChart();
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.error = 'Không thể tải dữ liệu bảng điều khiển';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 5. Thêm logic renderChart
    renderChart(): void {
    if (!this.dashboardData || !this.dashboardData.topProducts) return;

    const labels = this.dashboardData.topProducts.map(p => p.productName);
    const data = this.dashboardData.topProducts.map(p => p.revenue);

    // 1. Định nghĩa bảng màu (Sử dụng hệ màu Tailwind cho hiện đại)
    const colorPalette = [
      '#4f46e5', // Indigo
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#8b5cf6', // Violet
      '#06b6d4', // Cyan
      '#ec4899', // Pink
    ];

    // 2. Tạo mảng màu tương ứng với số lượng sản phẩm
    // Dùng phép chia lấy dư (%) để nếu sản phẩm nhiều hơn màu thì nó sẽ lặp lại vòng màu
    const backgroundColors = data.map((_, index) => colorPalette[index % colorPalette.length]);

    setTimeout(() => {
      const canvas = document.getElementById('topProductChart') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx!, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Doanh thu',
            data,
            // 3. Gán mảng màu vào đây
            backgroundColor: backgroundColors, 
            // Bạn có thể thêm border nếu muốn cột sắc nét hơn
            borderColor: backgroundColors.map(color => color), 
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            // Tùy chỉnh tooltip để hiện màu tương ứng
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              usePointStyle: true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                drawOnChartArea: true,
                color: '#f3f4f6' // Màu lưới nhạt cho đẹp
              }
            },
            x: {
              grid: {
                display: false // Tắt lưới trục X để nhìn thoáng hơn
              }
            }
          }
        }
      });
    });
  }

  importProduct(productId: string): void {
    this.router.navigate(['/inventory/purchase-orders/create'], {
      queryParams: { productId }
    });
  }
}