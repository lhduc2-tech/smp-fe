import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { Staff } from '../../models/staff.model';

@Component({
  selector: 'app-staff-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="staff-form-container">
      <div class="header">
        <h1>{{ isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới' }}</h1>
      </div>

      <form (ngSubmit)="submitForm()" class="form">
        <div class="form-group">
          <label>Tên nhân viên *</label>
          <input 
            type="text" 
            [(ngModel)]="staff.name"
            name="name"
            placeholder="Nhập tên nhân viên"
            required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              [(ngModel)]="staff.email"
              name="email"
              placeholder="Nhập email"
              required>
          </div>

          <div class="form-group">
            <label>Số điện thoại *</label>
            <input 
              type="tel" 
              [(ngModel)]="staff.phone"
              name="phone"
              placeholder="Nhập số điện thoại"
              required>
          </div>
        </div>

        <div class="form-group">
          <label>Chức vụ *</label>
          <input 
            type="text" 
            [(ngModel)]="staff.position"
            name="position"
            placeholder="Nhập chức vụ"
            required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Ngày vào làm *</label>
            <input 
              type="date" 
              [(ngModel)]="staff.joinDate"
              name="joinDate"
              required>
          </div>

          <div class="form-group">
            <label>Trạng thái *</label>
            <select [(ngModel)]="staff.status" name="status" required>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit">{{ isEdit ? 'Cập nhật' : 'Thêm mới' }}</button>
          <a routerLink="/settings/staff" class="btn-cancel">Hủy</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .staff-form-container {
      padding: 20px;
      max-width: 800px;
    }

    .header {
      margin-bottom: 30px;
    }

    h1 {
      font-size: 28px;
      color: #333;
      margin: 0;
    }

    .form {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    input, select {
      width: 100%;
      padding: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #6366F1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }

    .btn-submit {
      background-color: #6366F1;
      color: white;
      padding: 10px 30px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .btn-submit:hover {
      background-color: #4F46E5;
    }

    .btn-cancel {
      background-color: #e0e0e0;
      color: #333;
      padding: 10px 30px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      transition: background-color 0.3s ease;
      display: inline-block;
    }

    .btn-cancel:hover {
      background-color: #d0d0d0;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .staff-form-container {
        padding: 15px;
      }

      .form {
        padding: 15px;
      }
    }
  `]
})
export class StaffFormComponent implements OnInit {
  staff: Staff = {
    id: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0]
  };

  isEdit = false;
  staffId: string = '';

  constructor(
    private staffService: StaffService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.staffId = params['id'];
        this.loadStaff();
      }
    });
  }

  loadStaff(): void {
    this.staffService.getStaffById(this.staffId).subscribe(staff => {
      if (staff) {
        this.staff = staff;
      }
    });
  }

  submitForm(): void {
    if (this.isEdit) {
      this.staffService.updateStaff(this.staff);
    } else {
      this.staffService.addStaff(this.staff);
    }
    this.router.navigate(['/settings/staff']);
  }
}
