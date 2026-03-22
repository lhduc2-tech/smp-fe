import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { AdminDashboard, MOCK_ADMIN_DASHBOARD } from '../../models/dashboard.model';
import { LucideAngularModule, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, AlertTriangle, Star, AlertCircle, TrendingUp as TrendingUpIcon } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class OwnerDashboardComponent implements OnInit {
  dashboardData: AdminDashboard = MOCK_ADMIN_DASHBOARD;
  
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

  constructor() {}

  ngOnInit(): void {
    // In a real application, we would fetch data from a service here
    this.dashboardData = MOCK_ADMIN_DASHBOARD;
  }
}
