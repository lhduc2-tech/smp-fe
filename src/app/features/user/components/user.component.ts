import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h2>User List</h2>
      <p>Trang danh sách user (placeholder)</p>
    </div>
  `,
  styles: [`
    .page {
      padding: 24px;
    }
  `]
})
export class UserListComponent {}
