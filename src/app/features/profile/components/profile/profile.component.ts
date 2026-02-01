import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService, UserProfile } from '../../services/profile.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="profile-container">
      <header class="profile-header">
        <div class="header-content">
          <div class="avatar-section">
            <div class="avatar-large">
              <img [src]="avatarPreview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + profile?.username" alt="Avatar">
              <div class="avatar-edit-overlay" (click)="fileInput.click()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="camera-icon">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none">
            </div>
            <div class="user-meta">
              <h1>{{ profile?.full_name || profile?.username }}</h1>
              <span class="badge">{{ profile?.roles?.[0] || 'Member' }}</span>
            </div>
          </div>
        </div>
        
        <nav class="profile-tabs">
          <button 
            [class.active]="activeTab === 'info'" 
            (click)="activeTab = 'info'">
            Thông tin cá nhân
          </button>
          <button 
            [class.active]="activeTab === 'security'" 
            (click)="activeTab = 'security'">
            Bảo mật & Mật khẩu
          </button>
        </nav>
      </header>

      <main class="profile-content">
        <!-- Tab: Information -->
        <div *ngIf="activeTab === 'info'" class="tab-pane animated-fade-in">
          <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()" class="professional-form">
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Họ và tên</label>
                <input type="text" formControlName="full_name" placeholder="Nhập họ và tên">
                <div class="error" *ngIf="profileForm.get('full_name')?.touched && profileForm.get('full_name')?.invalid">
                  Vui lòng nhập họ tên
                </div>
              </div>

              <div class="form-group">
                <label>Email</label>
                <input type="email" formControlName="email" placeholder="example@domain.com">
                <div class="error" *ngIf="profileForm.get('email')?.touched && profileForm.get('email')?.invalid">
                  Email không hợp lệ
                </div>
              </div>

              <div class="form-group">
                <label>Số điện thoại</label>
                <input type="text" formControlName="phone_number" placeholder="09xx xxx xxx">
                <div class="error" *ngIf="profileForm.get('phone_number')?.touched && profileForm.get('phone_number')?.invalid">
                  Số điện thoại không hợp lệ
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="profileForm.invalid || loading">
                {{ loading ? 'Đang lưu...' : 'Lưu thay đổi' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Tab: Security -->
        <div *ngIf="activeTab === 'security'" class="tab-pane animated-fade-in">
          <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="professional-form">
            <div class="section-header">
              <h3>Đổi mật khẩu</h3>
              <p class="section-desc">Hãy sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn.</p>
            </div>
            
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Mật khẩu hiện tại</label>
                <input type="password" formControlName="oldPassword" placeholder="••••••••">
              </div>

              <div class="form-group">
                <label>Mật khẩu mới</label>
                <input type="password" formControlName="newPassword" placeholder="Tối thiểu 8 ký tự">
              </div>

              <div class="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <input type="password" formControlName="confirmPassword" placeholder="Nhập lại mật khẩu mới">
                <div class="error" *ngIf="passwordForm.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched">
                  Mật khẩu xác nhận không khớp
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="passwordForm.invalid || loading">
                {{ loading ? 'Đang cập nhật...' : 'Đổi mật khẩu' }}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .profile-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 24px;
    }

    .profile-header {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      margin-bottom: 24px;
      overflow: hidden;
    }

    .header-content {
      padding: 32px;
      background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .avatar-large {
      width: 100px;
      height: 100px;
      border-radius: 20px;
      background: white;
      padding: 4px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      position: relative;
      cursor: pointer;
      overflow: hidden;
    }

    .avatar-large img {
      width: 100%;
      height: 100%;
      border-radius: 16px;
      object-fit: cover;
    }

    .avatar-edit-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s;
      border-radius: 16px;
    }

    .avatar-large:hover .avatar-edit-overlay {
      opacity: 1;
    }

    .camera-icon {
      width: 32px;
      height: 32px;
      color: white;
    }

    .user-meta h1 {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      color: #0f172a;
    }

    .badge {
      background: #6366f1;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .profile-tabs {
      display: flex;
      padding: 0 32px;
      border-top: 1px solid #f1f5f9;
      background: white;
    }

    .profile-tabs button {
      padding: 16px 24px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: #64748b;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .profile-tabs button:hover {
      color: #6366f1;
    }

    .profile-tabs button.active {
      color: #6366f1;
      border-bottom-color: #6366f1;
    }

    .profile-content {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }

    .professional-form {
      max-width: 800px; /* Tăng nhẹ chiều rộng tổng thể để grid thoáng hơn */
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px 32px; /* Tăng khoảng cách ngang giữa các cột */
      margin-bottom: 32px;
    }

    .form-group.full-width {
      grid-column: 1 / -1; /* Ép trường này chiếm trọn 2 cột */
    }

    .section-header {
      margin-bottom: 32px;
    }

    .section-header h3 {
      margin: 0 0 8px 0;
      font-size: 1.25rem;
      color: #0f172a;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
    }

    .form-group input {
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.9375rem;
      transition: all 0.2s;
    }

    .form-group input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
      outline: none;
    }

    .disabled-input {
      background-color: #f8fafc;
      cursor: not-allowed;
    }

    .form-group small {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .error {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 4px;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      background: #4f46e5;
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .narrow-form {
      max-width: 500px;
    }

    .section-desc {
      color: #64748b;
      font-size: 0.875rem;
      margin-bottom: 24px;
    }

    .animated-fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .professional-form .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
    profile: UserProfile | null = null;
    activeTab: 'info' | 'security' = 'info';
    profileForm: FormGroup;
    passwordForm: FormGroup;
    loading = false;
    avatarPreview: string | null = null;
    selectedFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService
    ) {
        this.profileForm = this.fb.group({
            full_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone_number: ['', Validators.required]
        });

        this.passwordForm = this.fb.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {
        this.profileService.getProfile().subscribe({
            next: (data) => {
                this.profile = data;
                this.profileForm.patchValue({
                    full_name: data.full_name,
                    email: data.email,
                    phone_number: data.phone_number
                });
            },
            error: (err) => console.error('Failed to load profile', err)
        });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('newPassword')?.value === g.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = () => {
                this.avatarPreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    onUpdateProfile(): void {
        if (this.profileForm.invalid) return;
        this.loading = true;
        this.profileService.updateProfile(this.profileForm.value).subscribe({
            next: (updated) => {
                this.profile = updated;
                this.loading = false;
                alert('Cập nhật hồ sơ thành công!');
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                alert('Có lỗi xảy ra khi cập nhật hồ sơ');
            }
        });
    }

    onChangePassword(): void {
        if (this.passwordForm.invalid) return;
        this.loading = true;
        this.profileService.changePassword(this.passwordForm.value).subscribe({
            next: () => {
                this.loading = false;
                this.passwordForm.reset();
                alert('Đổi mật khẩu thành công!');
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                alert(err.error?.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ.');
            }
        });
    }
}
