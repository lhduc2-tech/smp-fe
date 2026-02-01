import { Component, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="topbar">
      <div class="topbar-left">
        <button class="toggle-sidebar-btn" (click)="toggleSidebar.emit()">
          <span class="menu-icon">☰</span>
        </button>
        <input 
          type="text" 
          class="search-box" 
          placeholder="Tìm kiếm..."
        />
      </div>

      <div class="topbar-right">
        <div class="notification-icon">
          <span class="icon">🔔</span>
          <span class="badge">3</span>
        </div>

        <!-- USER PROFILE (GIỮ NGUYÊN UI) -->
        <div class="user-profile" (click)="toggleDropdown($event)">
          <img 
            [src]="userName ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userName : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'" 
            alt="User Avatar" 
            class="avatar"
          />
          <span class="username">{{ userName || 'Guest' }}</span>
          <button class="dropdown-toggle" type="button">
            <span>▼</span>
          </button>

          <!-- DROPDOWN -->
          <div class="dropdown-menu" *ngIf="dropdownOpen">
            <button class="dropdown-item logout" (click)="logout($event)">
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .topbar {
      height: 60px;
      background-color: #fff;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 15px;
      flex: 1;
    }

    .toggle-sidebar-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 20px;
      color: #333;
      padding: 5px;
    }

    .search-box {
      flex: 1;
      max-width: 300px;
      padding: 8px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      background-color: #f5f5f5;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .notification-icon {
      position: relative;
      font-size: 20px;
      cursor: pointer;
    }

    .badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #ff4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    /* ===== USER PROFILE – GIỮ NGUYÊN ===== */
    .user-profile {
      position: relative; /* QUAN TRỌNG cho dropdown */
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 10px;
      border-radius: 6px;
      cursor: pointer;
    }

    .user-profile:hover {
      background-color: #f5f5f5;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e0e0e0;
    }

    .username {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .dropdown-toggle {
      background: none;
      border: none;
      cursor: pointer;
      color: #999;
      font-size: 12px;
    }

    /* ===== DROPDOWN ===== */
    .dropdown-menu {
      position: absolute;
      top: 110%;
      right: 0;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      min-width: 140px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.08);
      z-index: 1000;
    }

    .dropdown-item {
      width: 100%;
      padding: 10px 14px;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
    }

    .dropdown-item:hover {
      background-color: #f5f5f5;
    }

    .dropdown-item.logout {
      color: #e53935;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .username {
        display: none;
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
