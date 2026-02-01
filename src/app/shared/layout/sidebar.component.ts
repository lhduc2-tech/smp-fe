import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon?: string;
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
      <!-- Logo Section -->
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">N</div>
          <span class="logo-text" *ngIf="sidebarOpen">Nhí Nhảnh</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div *ngFor="let section of menuSections" class="nav-section">
          <h3 class="section-title" *ngIf="sidebarOpen">{{ section.title }}</h3>
          
          <div class="menu-items">
            <ng-container *ngFor="let item of section.items">
              <!-- Regular Link -->
              <a 
                *ngIf="!item.children || item.children.length === 0"
                [routerLink]="item.route"
                routerLinkActive="active"
                class="menu-link"
                [title]="item.label">
                <span class="icon" [innerHTML]="item.icon"></span>
                <span class="label" *ngIf="sidebarOpen">{{ item.label }}</span>
              </a>

              <!-- Parent Item with Submenu -->
              <div *ngIf="item.children && item.children.length > 0" class="menu-group">
                <button 
                  class="menu-link parent-link"
                  (click)="toggleSubmenu(item)"
                  [class.expanded]="item.expanded"
                  [title]="item.label">
                  <span class="icon" [innerHTML]="item.icon"></span>
                  <span class="label" *ngIf="sidebarOpen">{{ item.label }}</span>
                  <span class="chevron" *ngIf="sidebarOpen">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
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
          </div>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .sidebar {
      width: 260px;
      height: 100%;
      background: #1e293b; /* Đã đổi từ #0f172a sáng lên #1e293b */
      color: #cbd5e1;
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2);
    }

    .sidebar.collapsed {
      width: 80px;
    }

    /* Logo Styling */
    .sidebar-header {
      height: 70px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      margin-bottom: 15px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 18px;
      flex-shrink: 0;
      box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
    }

    .logo-text {
      color: #f8fafc;
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      white-space: nowrap;
    }

    /* Nav Sections */
    .sidebar-nav {
      flex: 1;
      padding: 0 12px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-section {
      margin-bottom: 20px;
    }

    .section-title {
      padding: 0 16px;
      margin-bottom: 8px;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #475569;
    }

    /* Menu Links */
    .menu-link {
      display: flex;
      align-items: center;
      justify-content: flex-start; /* Luôn bám trái */
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
      text-align: left; /* Cực kỳ quan trọng cho button */
    }

    .menu-link:hover {
      background: rgba(255, 255, 255, 0.04);
      color: #f1f5f9;
    }

    .menu-link.active {
      background: rgba(99, 102, 241, 0.1);
      color: #818cf8;
      font-weight: 600;
    }

    .menu-link.active .icon ::ng-deep svg {
      color: #818cf8;
    }

    /* Cấu hình/Parent Item alignment */
    .parent-link {
      position: relative;
    }

    .chevron {
      width: 14px;
      height: 14px;
      margin-left: auto; /* Đẩy mũi tên về cuối */
      transition: transform 0.3s ease;
      opacity: 0.5;
    }

    .parent-link.expanded .chevron {
      transform: rotate(180deg);
    }

    .sidebar.collapsed .menu-link {
      justify-content: center;
      padding: 12px;
    }

    .icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon ::ng-deep svg {
      width: 100%;
      height: 100%;
      stroke: currentColor;
    }

    .label {
      font-size: 0.9rem;
      white-space: nowrap;
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
      gap: 12px;
      padding: 8px 16px 8px 48px; /* Giảm nhẹ padding khi bỏ dấu chấm */
      font-size: 0.85rem;
      color: #94a3b8;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;
      position: relative;
    }

    .submenu-link:hover {
      color: #f1f5f9;
      background: rgba(255, 255, 255, 0.04);
    }

    .submenu-link.active {
      background: rgba(99, 102, 241, 0.08);
      color: #818cf8;
      font-weight: 600;
    }


    /* Custom Scrollbar */
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
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>',
          route: '/dashboard'
        },
        {
          label: 'Đơn hàng',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
          route: '/orders'
        },
        {
          label: 'Sản phẩm',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
          route: '/products'
        },
      ]
    },
    {
      title: 'Vận hành',
      items: [
        {
          label: 'Quản lý kho',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
          route: '/inventory'
        },
        {
          label: 'Khách hàng',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
          route: '/customers'
        },
        {
          label: 'Báo cáo',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
          route: '/reports'
        },
      ]
    },
    {
      title: 'Hệ thống',
      items: [
        {
          label: 'Cấu hình',
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
          expanded: false,
          children: [
            { label: 'Nhân viên', route: '/settings/staff' }
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
