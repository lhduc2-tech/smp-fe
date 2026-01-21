import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
          placeholder="Tìm kiếm (Ctrl + K)"
        />
      </div>

      <div class="topbar-right">
        <div class="notification-icon">
          <span class="icon">🔔</span>
          <span class="badge">3</span>
        </div>
        <div class="user-profile">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tduc" 
            alt="User Avatar" 
            class="avatar"
          />
          <span class="username">Tduc</span>
          <button class="dropdown-toggle">
            <span>▼</span>
          </button>
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
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.3s ease;
    }

    .toggle-sidebar-btn:hover {
      color: #0066ff;
    }

    .menu-icon {
      display: inline-block;
    }

    .search-box {
      flex: 1;
      max-width: 300px;
      padding: 8px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      background-color: #f5f5f5;
      transition: all 0.3s ease;
    }

    .search-box:focus {
      outline: none;
      border-color: #0066ff;
      background-color: #fff;
      box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
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
      transition: transform 0.3s ease;
    }

    .notification-icon:hover {
      transform: scale(1.1);
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

    .user-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 10px;
      border-radius: 6px;
      transition: background-color 0.3s ease;
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
      padding: 2px 5px;
      transition: color 0.3s ease;
    }

    .dropdown-toggle:hover {
      color: #0066ff;
    }

    @media (max-width: 768px) {
      .topbar {
        padding: 0 15px;
      }

      .search-box {
        max-width: none;
        flex: 1;
        min-width: 150px;
      }

      .username {
        display: none;
      }

      .topbar-right {
        gap: 15px;
      }
    }
  `]
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() sidebarOpen = true;
}
