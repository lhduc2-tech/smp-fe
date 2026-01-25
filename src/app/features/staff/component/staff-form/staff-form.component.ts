import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { Staff } from '../../models/staff.model';
import { ToastService } from '../../../../shared/components/toast/toast';

@Component({
  selector: 'app-staff-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './staff-form.component.html',
  styleUrls: ['./staff-form.component.css']
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
    private router: Router,
    private toastService: ToastService
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
        this.toastService.error(`Không thể tải thông tin nhân viên: ${errorMessage}`);
        this.router.navigate(['/settings/staff']);
      }
    });
  }

  submitForm(): void {
    if (!this.staffForm.valid) {
      this.toastService.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
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
          this.toastService.success('Cập nhật nhân viên thành công');
          this.router.navigate(['/settings/staff']);
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật nhân viên:', error);
          const errorMessage = this.getErrorMessage(error);
          this.toastService.error(errorMessage);
          this.isLoading = false;
        }
      });
    } else {
      this.staffService.addStaff(formData).subscribe({
        next: () => {
          this.toastService.success('Thêm nhân viên thành công');
          this.router.navigate(['/settings/staff']);
        },
        error: (error) => {
          // Log chi tiết lỗi ra console để debug
          console.error('Lỗi khi thêm nhân viên (Chi tiết):', JSON.stringify(error, null, 2));
          console.error('Error Object Direct:', error);

          const errorMessage = this.getErrorMessage(error);
          this.toastService.error(errorMessage);
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
