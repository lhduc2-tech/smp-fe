import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { StaffDashboard, MOCK_STAFF_DASHBOARD } from '../../models/dashboard.model';
import { LucideAngularModule, ShoppingBag, Clock, CheckCircle, XCircle, DollarSign, AlertTriangle, Package } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-staff',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './dashboard-staff.component.html',
  styleUrls: ['./dashboard-staff.component.css']
})
export class StaffDashboardComponent implements OnInit {
  dashboardData: StaffDashboard = MOCK_STAFF_DASHBOARD;

  // Icons
  readonly ShoppingBag = ShoppingBag;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly DollarSign = DollarSign;
  readonly AlertTriangle = AlertTriangle;
  readonly Package = Package;

  constructor() {}

  ngOnInit(): void {
    // In a real application, we would fetch real data
    this.dashboardData = MOCK_STAFF_DASHBOARD;
  }
}
