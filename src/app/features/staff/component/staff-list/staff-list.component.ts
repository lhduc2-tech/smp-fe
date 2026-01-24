import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { Staff } from '../../models/staff.model';
import { IconComponent } from '../../../../shared/components/icon.component';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="staff-list-container">
      <div class="header">
        <h1>Quản lý nhân viên</h1>
        <a routerLink="add" class="btn-add">+ Thêm nhân viên</a>
      </div>

      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          [(ngModel)]="searchTerm"
          (input)="filterStaff()">
      </div>

      <div class="staff-table">
        <table>
          <thead>
            <tr>
              <th>Tên nhân viên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let staff of filteredStaff">
              <td>{{ staff.fullName }}</td>
              <td>{{ staff.email }}</td>
              <td>{{ staff.phoneNumber }}</td>
              <td>{{ staff.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
              <td class="actions">
                <a [routerLink]="staff.id" class="action-icon" title="Sửa">
                  <app-icon type="edit"></app-icon>
                </a>
                <button (click)="deleteStaff(staff.id)" class="action-icon" title="Xóa">
                  <app-icon type="delete"></app-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredStaff.length === 0" class="no-data">
          Không tìm thấy nhân viên
        </div>
      </div>
    </div>
  `,
  styles: [`
    .staff-list-container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    h1 {
      font-size: 28px;
      color: #333;
      margin: 0;
    }

    .btn-add {
      background-color: #6366F1;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }

    .btn-add:hover {
      background-color: #4F46E5;
    }

    .search-bar {
      margin-bottom: 20px;
    }

    .search-bar input {
      width: 100%;
      max-width: 400px;
      padding: 10px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
    }

    .search-bar input:focus {
      outline: none;
      border-color: #6366F1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .staff-table {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e0e0e0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: #f5f5f5;
      border-bottom: 2px solid #e0e0e0;
    }

    th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    tbody tr {
      border-bottom: 1px solid #e0e0e0;
      transition: background-color 0.2s ease;
    }

    tbody tr:hover {
      background-color: #f9f9f9;
    }

    td {
      padding: 15px;
      color: #666;
      font-size: 14px;
    }

    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background-color: #f0f0f0;
      color: #666;
    }

    .status.active {
      background-color: #d4edda;
      color: #28a745;
    }

    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .action-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: opacity 0.2s ease;
    }

    .action-icon:hover {
      opacity: 0.8;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #999;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      table {
        font-size: 12px;
      }

      th, td {
        padding: 10px;
      }
    }
  `]
})
export class StaffListComponent implements OnInit {
  staffList: Staff[] = [];
  filteredStaff: Staff[] = [];
  searchTerm = '';
  isLoading = false;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.isLoading = true;
    this.staffService.getStaffList().subscribe({
      next: (staff) => {
        this.staffList = staff;
        this.filterStaff();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải danh sách nhân viên:', error);
        this.isLoading = false;
      }
    });
  }

  filterStaff(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStaff = this.staffList;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredStaff = this.staffList.filter(staff =>
        staff.fullName.toLowerCase().includes(term) ||
        staff.email.toLowerCase().includes(term) ||
        staff.phoneNumber.includes(term)
      );
    }
  }

  deleteStaff(id: string): void {
    if (confirm('Bạn chắc chắn muốn xóa nhân viên này?')) {
      this.staffService.deleteStaff(id).subscribe({
        next: () => {
          console.log('Xóa nhân viên thành công');
          this.loadStaff();
        },
        error: (error) => {
          console.error('Lỗi khi xóa nhân viên:', error);
          alert('Không thể xóa nhân viên. Vui lòng thử lại!');
        }
      });
    }
  }
}
