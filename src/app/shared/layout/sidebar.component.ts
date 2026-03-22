import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SHARED_UI_IMPORTS } from '../../shared/components/ui';
import type { ZardIcon } from '../../shared/components/ui/icon/icons';

interface MenuItem {
  label: string;
  icon?: ZardIcon;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ...SHARED_UI_IMPORTS],
  template: `
    <z-sidebar
      [zWidth]="260"
      [zCollapsedWidth]="80"
      [zCollapsible]="false"
      [zCollapsed]="!sidebarOpen"
      class="sidebar-wrapper"
      [class.collapsed]="!sidebarOpen"
    >
      <!-- Logo Section -->
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">N</div>
          <span class="logo-text" *ngIf="sidebarOpen">Nhí Nhảnh</span>
        </div>
      </div>

      <!-- Menu Sections -->
      <nav class="sidebar-nav">
        <ng-container *ngFor="let section of menuSections; let last = last">
          <z-sidebar-group>
            <z-sidebar-group-label *ngIf="sidebarOpen">
              {{ section.title }}
            </z-sidebar-group-label>

            <ng-container *ngFor="let item of section.items">
              <!-- Regular Link -->
              <a
                *ngIf="!item.children || item.children.length === 0"
                [routerLink]="item.route"
                routerLinkActive="active"
                class="menu-link"
                [title]="item.label">
                <z-icon *ngIf="item.icon" [zType]="item.icon" zSize="default" class="menu-icon" />
                <span class="label" *ngIf="sidebarOpen">{{ item.label }}</span>
              </a>

              <!-- Parent Item with Submenu -->
              <div *ngIf="item.children && item.children.length > 0" class="menu-group">
                <button
                  class="menu-link parent-link"
                  (click)="toggleSubmenu(item)"
                  [class.expanded]="item.expanded"
                  [title]="item.label">
                  <z-icon *ngIf="item.icon" [zType]="item.icon" zSize="default" class="menu-icon" />
                  <span class="label" *ngIf="sidebarOpen">{{ item.label }}</span>
                  <z-icon
                    *ngIf="sidebarOpen"
                    zType="chevron-down"
                    zSize="default"
                    class="chevron"
                    [class.rotated]="item.expanded"
                  />
                </button>

                <div class="submenu" *ngIf="item.expanded && sidebarOpen">
                  <a
                    *ngFor="let child of item.children"
                    [routerLink]="child.route"
                    routerLinkActive="active"
                    class="submenu-link">
                    {{ child.label }}
                  </a>
                </div>
              </div>
            </ng-container>
          </z-sidebar-group>

          <z-divider *ngIf="!last" class="section-divider" />
        </ng-container>
      </nav>
    </z-sidebar>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;

      /* Override sidebar theme to dark */
      --sidebar: #1e293b;
      --sidebar-foreground: #cbd5e1;
      --sidebar-accent: #334155;
      --sidebar-accent-foreground: #f1f5f9;
      --sidebar-border: rgba(255, 255, 255, 0.05);
      --sidebar-ring: #475569;
    }

    .sidebar-wrapper {
      padding: 0 !important;
      border-right: none !important;
      box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2);
    }

    :host ::ng-deep .sidebar-wrapper .flex-1.overflow-auto {
      overflow: hidden !important;
    }

    /* Logo */
    .sidebar-header {
      height: 70px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 8px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #1e293b, #334155);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 18px;
      flex-shrink: 0;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    .logo-text {
      color: #f8fafc;
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      white-space: nowrap;
    }

    /* Nav */
    .sidebar-nav {
      flex: 1;
      padding: 0 12px;
      overflow: hidden;
    }

    .section-divider {
      margin: 8px 16px;
      opacity: 0.08;
      border-color: #fff;
    }

    /* Icon sizing */
    .menu-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    /* Menu Links */
    .menu-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 8px;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.2s ease;
      margin-bottom: 2px;
      background: transparent;
      border: none;
      width: 100%;
      cursor: pointer;
      text-align: left;
      font-size: 0.9rem;
    }

    .menu-link:hover {
      background: rgba(255, 255, 255, 0.04);
      color: #f1f5f9;
    }

    .menu-link.active {
      background: rgba(255, 255, 255, 0.08);
      color: #f1f5f9;
      font-weight: 600;
    }

    /* Chevron */
    .chevron {
      margin-left: auto;
      opacity: 0.5;
      transition: transform 0.3s ease;
      width: 14px;
      height: 14px;
    }

    .chevron.rotated {
      transform: rotate(180deg);
    }

    /* Collapsed */
    :host ::ng-deep z-sidebar.collapsed .menu-link {
      justify-content: center;
      padding: 12px;
      gap: 0;
    }

    :host ::ng-deep z-sidebar.collapsed .sidebar-header {
      justify-content: center;
      padding: 0 12px;
    }

    :host ::ng-deep z-sidebar.collapsed .sidebar-nav {
      padding: 0 8px;
    }

    /* Submenu */
    .submenu {
      margin-top: 2px;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .submenu-link {
      display: flex;
      align-items: center;
      padding: 8px 16px 8px 48px;
      font-size: 0.85rem;
      color: #94a3b8;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .submenu-link:hover {
      color: #f1f5f9;
      background: rgba(255, 255, 255, 0.04);
    }

    .submenu-link.active {
      background: rgba(255, 255, 255, 0.06);
      color: #f1f5f9;
      font-weight: 600;
    }

    /* Scrollbar */
    .sidebar-nav::-webkit-scrollbar {
      width: 3px;
    }
    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }
  `]
})
export class SidebarComponent {
  @Input() sidebarOpen = true;

  menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Quản lý chính',
      items: [
        {
          label: 'Tổng quan',
          icon: 'layout-dashboard',
          route: '/dashboard'
        },
        {
          label: 'Đơn hàng',
          icon: 'clipboard',
          route: '/orders'
        },
        {
          label: 'Sản phẩm',
          icon: 'shopping-cart',
          route: '/products'
        },
        {
          label: 'Danh mục',
          icon: 'tag',
          route: '/categories'
        },
        {
          label: 'Nhà cung cấp',
          icon: 'tag',
          route: '/supplier'
        },
      ]
    },
    {
    title: 'Vận hành',
    items: [
      {
        label: 'Phiếu nhập',
        icon: 'package',
        route: '/inventory/purchase-orders'
      },
      {
        label: 'Lịch sử kho',
        icon: 'layers',
        route: '/inventory/stock-movements'
      },
      {
        label: 'Khách hàng',
        icon: 'users',
        route: '/customers'
      }
    ]
  },
    {
      title: 'Hệ thống',
      items: [
        {
          label: 'Cấu hình',
          icon: 'settings',
          expanded: false,
          children: [
            { label: 'Nhân viên', route: '/settings/staff' },
            { label: 'Nhóm vai trò', route: '/settings/role' }
          ]
        }
      ]
    }
  ];

  toggleSubmenu(item: MenuItem) {
    if (item.children && item.children.length > 0) {
      item.expanded = !item.expanded;
    }
  }
}
