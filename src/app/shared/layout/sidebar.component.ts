import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="!sidebarOpen">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-text">Nhí nhảnh</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <!-- Main Menu Items -->
        <div class="menu-section">
          <ng-container *ngFor="let item of mainMenuItems">
            <!-- Menu item with route -->
            <a 
              *ngIf="!item.children || item.children.length === 0"
              routerLink="{{ item.route }}"
              routerLinkActive="active"
              class="menu-item"
              [routerLinkActiveOptions]="{ exact: false }">
              <span class="icon">{{ item.icon }}</span>
              <span class="label">{{ item.label }}</span>
            </a>

            <!-- Menu item with submenu -->
            <div *ngIf="item.children && item.children.length > 0" class="menu-group">
              <button 
                class="menu-item menu-parent"
                (click)="toggleSubmenu(item)">
                <span class="icon">{{ item.icon }}</span>
                <span class="label">{{ item.label }}</span>
                <span class="arrow" [class.expanded]="item.expanded">▶</span>
              </button>
              
              <!-- Submenu items -->
              <div class="submenu" *ngIf="item.expanded">
                <a 
                  *ngFor="let child of item.children"
                  routerLink="{{ child.route }}"
                  routerLinkActive="active"
                  class="submenu-item"
                  [routerLinkActiveOptions]="{ exact: false }">
                  <span class="icon">{{ child.icon }}</span>
                  <span class="label">{{ child.label }}</span>
                </a>
              </div>
            </div>
          </ng-container>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: #1e1b4b;
      color: #fff;
      overflow-y: auto;
      transition: width 0.3s ease;
      border-right: 1px solid #312e81;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .sidebar.collapsed {
      width: 70px;
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid #2d3154;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
    }

    .logo-text {
      background: linear-gradient(135deg, #6366F1, #4F46E5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .sidebar-nav {
      padding: 20px 0;
      flex: 1;
    }

    .menu-section,
    .menu-section-group {
      padding: 10px 0;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: #8892a8;
      padding: 15px 20px 10px;
      margin: 0;
      letter-spacing: 0.5px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      color: #a0afc0;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      cursor: pointer;
    }

    .menu-item:hover {
      background-color: #312e81;
      color: #fff;
    }

    .menu-item.active {
      background-color: #6366F1;
      color: #fff;
      border-left-color: #a5b4fc;
    }

    .menu-parent {
      background: none;
      border: none;
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 20px;
      justify-content: flex-start;
      position: relative;
    }

    .arrow {
      font-size: 12px;
      transition: transform 0.3s ease;
      color: #8892a8;
      margin-left: auto;
    }

    .arrow.expanded {
      transform: rotate(90deg);
    }

    .submenu {
      background-color: rgba(0, 0, 0, 0.2);
    }

    .submenu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px 10px 50px;
      color: #a0afc0;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      cursor: pointer;
      font-size: 14px;
    }

    .submenu-item:hover {
      background-color: #312e81;
      color: #fff;
    }

    .submenu-item.active {
      background-color: #6366F1;
      color: #fff;
      border-left-color: #a5b4fc;
    }

    .icon {
      font-size: 16px;
      min-width: 20px;
    }

    .label {
      flex: 1;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar.collapsed .label {
      display: none;
    }

    .sidebar.collapsed .menu-item {
      justify-content: center;
      padding: 12px;
    }

    .sidebar.collapsed .section-title {
      display: none;
    }

    /* Scrollbar styling */
    .sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar::-webkit-scrollbar-track {
      background: transparent;
    }

    .sidebar::-webkit-scrollbar-thumb {
      background: #3d4563;
      border-radius: 3px;
    }

    .sidebar::-webkit-scrollbar-thumb:hover {
      background: #4d5573;
    }
  `]
})
export class SidebarComponent {
  @Input() sidebarOpen = true;

  mainMenuItems: MenuItem[] = [
    { label: 'Tổng quan', icon: '📊', route: '/dashboard' },
    { label: 'Đơn hàng', icon: '📋', route: '/orders' },
    { label: 'Sản phẩm', icon: '🛒', route: '/products' },
    { label: 'Quản lý kho', icon: '🏭', route: '/inventory' },
    { label: 'Khách hàng', icon: '👥', route: '/customers' },
    { label: 'Báo cáo', icon: '📈', route: '/reports' },
    {
      label: 'Cấu hình',
      icon: '⚙️',
      expanded: false,
      children: [
        { label: 'Nhân viên', icon: '👤', route: '/settings/staff' }
      ]
    }
  ];

  toggleSubmenu(item: MenuItem) {
    if (item.children && item.children.length > 0) {
      item.expanded = !item.expanded;
    }
  }
}
