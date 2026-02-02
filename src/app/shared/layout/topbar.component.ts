import { Component, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="topbar">
      <div class="topbar-left">
        <button class="toggle-sidebar-btn" (click)="toggleSidebar.emit()" title="Toggle Sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-icon-svg">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

      </div>

      <div class="topbar-right">
        <!-- USER PROFILE -->
        <div class="user-profile" (click)="toggleDropdown($event)" [class.active]="dropdownOpen">
          <div class="avatar-wrapper">
            <img 
              [src]="userName ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userName : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'" 
              alt="User Avatar" 
              class="avatar"
            />
          </div>
          <div class="user-info">
            <span class="username">{{ userName || 'Guest' }}</span>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="chevron-icon">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>

          <!-- DROPDOWN -->
          <div class="dropdown-menu" *ngIf="dropdownOpen">
            <button class="dropdown-item" routerLink="/profile" (click)="dropdownOpen = false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="item-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Hồ sơ của tôi
            </button>
            <button class="dropdown-item logout" (click)="logout($event)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="item-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .topbar {
      height: 70px;
      background-color: #ffffff;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 1;
    }

    .toggle-sidebar-btn {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      cursor: pointer;
      color: #64748b;
      padding: 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .toggle-sidebar-btn:hover {
      background: #f1f5f9;
      color: #0f172a;
      border-color: #cbd5e1;
    }

    .menu-icon-svg {
      width: 20px;
      height: 20px;
    }



    .topbar-right {
      display: flex;
      align-items: center;
    }

    /* ===== USER PROFILE ===== */
    .user-profile {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .user-profile:hover .username, 
    .user-profile.active .username {
      color: #6366f1;
    }

    .avatar-wrapper {
      position: relative;
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      object-fit: cover;
      background-color: #f1f5f9;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .username {
      font-size: 0.875rem;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.25;
    }

    .user-role {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    .chevron-icon {
      width: 16px;
      height: 16px;
      color: #94a3b8;
      transition: transform 0.2s;
    }

    .user-profile.active .chevron-icon {
      transform: rotate(180deg);
    }

    /* ===== DROPDOWN ===== */
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      min-width: 200px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 1000;
      padding: 8px;
      animation: slideIn 0.2s ease-out;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dropdown-header {
      padding: 8px 12px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #94a3b8;
      letter-spacing: 0.05em;
    }

    .dropdown-item {
      width: 100%;
      padding: 10px 12px;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      font-size: 0.875rem;
      color: #475569;
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .dropdown-item:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }

    .item-icon {
      width: 18px;
      height: 18px;
      color: #64748b;
    }

    .dropdown-divider {
      height: 1px;
      background-color: #f1f5f9;
      margin: 8px 0;
    }

    .dropdown-item.logout {
      color: #ef4444;
    }

    .dropdown-item.logout:hover {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .dropdown-item.logout .item-icon {
      color: currentColor;
    }

    @media (max-width: 768px) {
      .user-info, .chevron-icon {
        display: none;
      }
      .topbar {
        padding: 0 16px;
      }
    }
  `]
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() sidebarOpen = true;

  dropdownOpen = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  get userName(): string | null {
    return this.authService.username;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(event: Event) {
    event.stopPropagation();
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  @HostListener('document:click')
  closeDropdown() {
    this.dropdownOpen = false;
  }
}
