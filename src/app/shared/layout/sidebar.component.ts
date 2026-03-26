import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SHARED_UI_IMPORTS } from '../../shared/components/ui';
import type { ZardIcon } from '../../shared/components/ui/icon/icons';
import { AuthService } from '../../features/auth/services/auth.service';

interface MenuItem {
  label: string;
  icon?: ZardIcon;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
  roles?: string[];
  permissions?: string[];
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
      <!-- Logo -->
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">N</div>
          <span class="logo-text" *ngIf="sidebarOpen">Nhí Nhảnh</span>
        </div>
      </div>

      <!-- Menu -->
      <nav class="sidebar-nav">
        <ng-container *ngFor="let section of filteredSections; let last = last">
          <z-sidebar-group>

            <z-sidebar-group-label *ngIf="sidebarOpen">
              {{ section.title }}
            </z-sidebar-group-label>

            <ng-container *ngFor="let item of section.items">

              <!-- Item thường -->
              <a
                *ngIf="!item.children || item.children.length === 0"
                [routerLink]="item.route"
                routerLinkActive="active"
                class="menu-link"
                [title]="item.label">
                <z-icon *ngIf="item.icon" [zType]="item.icon" class="menu-icon" />
                <span *ngIf="sidebarOpen">{{ item.label }}</span>
              </a>

              <!-- Item có submenu -->
              <div *ngIf="item.children?.length" class="menu-group">
                <button
                  class="menu-link parent-link"
                  (click)="toggleSubmenu(item)"
                  [class.expanded]="item.expanded">

                  <z-icon *ngIf="item.icon" [zType]="item.icon" class="menu-icon" />
                  <span *ngIf="sidebarOpen">{{ item.label }}</span>

                  <z-icon
                    *ngIf="sidebarOpen"
                    zType="chevron-down"
                    class="chevron"
                    [class.rotated]="item.expanded" />
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
      overflow-y: auto !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    :host ::ng-deep .sidebar-wrapper .flex-1.overflow-auto::-webkit-scrollbar {
      display: none !important;
    }
    :host ::ng-deep .sidebar-wrapper * {
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
    :host ::ng-deep .sidebar-wrapper *::-webkit-scrollbar {
      display: none !important;
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
      /* Remove overflow to let the parent handle scrolling */
      overflow: visible;
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
      display: none;
    }
  `]
})
export class SidebarComponent implements OnInit {

  @Input() sidebarOpen = true;

  constructor(private auth: AuthService) {}

  // 🔥 MENU GỐC
  menuSections = [
    {
      title: 'Quản lý chính',
      items: [
        {
          label: 'Tổng quan',
          icon: 'layout-dashboard' as ZardIcon,
          route: '/dashboard',
          roles: ['ADMIN', 'STAFF']
        },
        {
          label: 'Đơn hàng',
          icon: 'clipboard' as ZardIcon,
          route: '/orders',
          permissions: ['order:read']
        },
        {
          label: 'Sản phẩm',
          icon: 'shopping-cart' as ZardIcon,
          route: '/products',
          permissions: ['product:read']
        },
        {
          label: 'Danh mục',
          icon: 'tag' as ZardIcon,
          route: '/categories',
          permissions: ['category:read']
        },
        {
          label: 'Nhà cung cấp',
          icon: 'tag' as ZardIcon,
          route: '/supplier',
          permissions: ['supplier:read']
        }
      ]
    },
    {
      title: 'Vận hành',
      items: [
        {
          label: 'Quản lý kho',
          icon: 'archive' as ZardIcon,
          route: '/inventory/warehouse',
          permissions: ['warehouse:read']
        },
        {
          label: 'Phiếu nhập',
          icon: 'package' as ZardIcon,
          route: '/inventory/purchase-orders',
          permissions: ['purchase_order:read']
        },
        {
          label: 'Lịch sử kho',
          icon: 'layers' as ZardIcon,
          route: '/inventory/stock-movements',
          permissions: ['inventory:read']
        },
        {
          label: 'Khách hàng',
          icon: 'users' as ZardIcon,
          route: '/customers',
          permissions: ['customer:read']
        }
      ]
    },
    {
      title: 'Hệ thống',
      items: [
        {
          label: 'Cấu hình',
          icon: 'settings' as ZardIcon,
          roles: ['ADMIN'],
          children: [
            {
              label: 'Nhân viên',
              route: '/settings/staff',
              permissions: ['staff:read']
            },
            {
              label: 'Nhóm vai trò',
              route: '/settings/role',
              permissions: ['role:read']
            }
          ]
        }
      ]
    }
  ];

  // ✅ MENU SAU KHI FILTER
  filteredSections: any[] = [];

  ngOnInit(): void {
    this.filteredSections = this.menuSections
      .map(section => ({
        ...section,
        items: section.items
          .map(item => this.filterItem(item))
          .filter((item): item is MenuItem => item !== null)
      }))
      .filter(section => section.items.length > 0);
  }

  // 🔥 CORE LOGIC
  private filterItem(item: MenuItem): MenuItem | null {

    // check role
    if (item.roles && !item.roles.some(r => this.auth.hasRole(r))) {
      return null;
    }

    // check permission
    if (item.permissions && !item.permissions.every(p => this.auth.hasPermission(p))) {
      return null;
    }

    // filter children
    if (item.children) {
      const children = item.children
        .map(child => this.filterItem(child))
        .filter(Boolean) as MenuItem[];

      if (children.length === 0) return null;

      return { ...item, children };
    }

    return item;
  }

  toggleSubmenu(item: MenuItem) {
    item.expanded = !item.expanded;
  }
  
}