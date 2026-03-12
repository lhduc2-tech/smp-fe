import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';
import { ToastComponent } from '../components/toast/toast';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog';
import { OrderPaymentDialogComponent } from '../../features/order/components/order-payment/order-payment-dialog.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, ToastComponent, ConfirmDialogComponent, OrderPaymentDialogComponent],
  template: `
    <div class="admin-layout">
      <app-sidebar [sidebarOpen]="sidebarOpen()"></app-sidebar>
      <div class="main-content">
        <app-topbar
          (toggleSidebar)="toggleSidebar()"
          [sidebarOpen]="sidebarOpen()">
        </app-topbar>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
        <app-toast></app-toast>
        <app-confirm-dialog></app-confirm-dialog>
        <app-order-payment-dialog></app-order-payment-dialog>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      height: 100vh;
      background-color: #f5f5f5;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    @media (max-width: 768px) {
      .admin-layout {
        flex-direction: column;
      }
    }
  `]
})
export class AdminLayoutComponent {
  sidebarOpen = signal(true);

  toggleSidebar() {
    this.sidebarOpen.update(val => !val);
  }
}
