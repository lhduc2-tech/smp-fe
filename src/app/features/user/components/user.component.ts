import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="header">
        <h2>User List</h2>

        <button class="logout-btn" (click)="logout()">
          Logout
        </button>
      </div>

      <p>Trang danh sách user (placeholder)</p>
    </div>
  `,
  styles: [`
    .page {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logout-btn {
      padding: 6px 14px;
      border: none;
      cursor: pointer;
      background: #c62828;
      color: #fff;
    }
  `]
})
export class UserListComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}
}
