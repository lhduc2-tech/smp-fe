import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { Staff } from '../../models/staff.model';

@Component({
  selector: 'app-staff-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="staff-form-container">
      <div class="header">
        <h1>{{ isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới' }}</h1>
      </div>

      <form (ngSubmit)="submitForm()" class="form" [formGroup]="staffForm">
        <div class="form-group">
          <label>Tên nhân viên *</label>
          <input 
            type="text" 
            formControlName="fullName"
            placeholder="Nhập tên nhân viên"
            required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              formControlName="email"
              placeholder="Nhập email"
              required>
          </div>

          <div class="form-group">
            <label>Số điện thoại *</label>
            <input 
              type="tel" 
              formControlName="phoneNumber"
              placeholder="Nhập số điện thoại"
              required>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" [disabled]="isLoading">
            {{ isLoading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Thêm mới') }}
          </button>
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
  staffForm: FormGroup;
  isEdit = false;
  staffId: string = '';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private staffService: StaffService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.staffForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]]
    });
  }

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
    this.staffService.getStaffById(this.staffId).subscribe({
      next: (staff) => {
        this.staffForm.patchValue({
          fullName: staff.fullName,
          email: staff.email,
          phoneNumber: staff.phoneNumber
        });
      },
      error: (error) => {
        console.error('Lỗi khi tải thông tin nhân viên:', error);
        const errorMessage = this.getErrorMessage(error);
        alert(`Không thể tải thông tin nhân viên:\n${errorMessage}`);
        this.router.navigate(['/settings/staff']);
      }
    });
  }

  submitForm(): void {
    if (!this.staffForm.valid) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    this.isLoading = true;
    const formData = this.staffForm.value;

    if (this.isEdit) {
      const staffData: Staff = {
        id: this.staffId,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      };

      this.staffService.updateStaff(staffData).subscribe({
        next: () => {
          console.log('Cập nhật nhân viên thành công');
          this.router.navigate(['/settings/staff']);
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật nhân viên:', error);
          const errorMessage = this.getErrorMessage(error);
          alert(`Cập nhật nhân viên thất bại:\n${errorMessage}`);
          this.isLoading = false;
        }
      });
    } else {
      this.staffService.addStaff(formData).subscribe({
        next: () => {
          console.log('Thêm nhân viên thành công');
          this.router.navigate(['/settings/staff']);
        },
        error: (error) => {
          console.error('Lỗi khi thêm nhân viên:', error);
          const errorMessage = this.getErrorMessage(error);
          alert(`Thêm nhân viên thất bại:\n${errorMessage}`);
          this.isLoading = false;
        }
      });
    }
  }

  private getErrorMessage(error: any): string {
    // Kiểm tra lỗi từ backend
    if (error?.error?.message) {
      return error.error.message;
    }
    
    // Kiểm tra lỗi validation từ backend
    if (error?.error?.errors) {
      const errors = error.error.errors;
      if (Array.isArray(errors)) {
        return errors.join('\n');
      }
      return Object.values(errors).join('\n');
    }
    
    // Kiểm tra HTTP error status
    if (error?.status) {
      const statusMessages: { [key: number]: string } = {
        400: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
        409: 'Email hoặc số điện thoại đã tồn tại trong hệ thống.',
        401: 'Bạn không có quyền thực hiện hành động này.',
        403: 'Bạn không có quyền truy cập.',
        404: 'Không tìm thấy dữ liệu.',
        500: 'Lỗi server. Vui lòng thử lại sau.'
      };
      return statusMessages[error.status] || `Lỗi (${error.status}): ${error.statusText || 'Không xác định'}`;
    }
    
    // Lỗi network
    if (error?.status === 0) {
      return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    }
    
    return 'Đã xảy ra lỗi. Vui lòng thử lại sau!';
  }
}
