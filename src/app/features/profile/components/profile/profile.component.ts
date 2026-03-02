import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService, UserProfile } from '../../services/profile.service';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...SHARED_UI_IMPORTS],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4 space-y-8">
      
      <!-- Profile Header -->
      <z-card class="overflow-hidden border-none shadow-sm rounded-2xl">
        <div class="bg-gradient-to-br from-slate-50 to-blue-50/50 p-8 sm:p-10">
          <div class="flex flex-col sm:flex-row items-center gap-6">
            
            <!-- Avatar -->
            <div class="relative h-28 w-28 rounded-2xl overflow-hidden bg-white p-1 shadow-lg cursor-pointer group hover:shadow-xl transition-all" (click)="fileInput.click()">
              <img [src]="avatarPreview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + profile?.username" alt="Avatar" class="h-full w-full object-cover rounded-xl" />
              
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl m-1">
                <z-icon zType="edit" class="h-8 w-8 text-white"></z-icon>
              </div>
              <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" class="hidden">
            </div>

            <!-- Meta -->
            <div class="text-center sm:text-left space-y-2">
              <h1 class="text-2xl font-bold text-slate-900 tracking-tight">{{ profile?.full_name || profile?.username || 'Đang tải...' }}</h1>
              <span class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                {{ profile?.roles?.[0] || 'Member' }}
              </span>
            </div>

          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex border-t border-slate-100 px-6 bg-white gap-6">
          <button 
            class="px-2 py-4 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none"
            [class.border-primary]="activeTab === 'info'"
            [class.text-primary]="activeTab === 'info'"
            [class.border-transparent]="activeTab !== 'info'"
            [class.text-muted-foreground]="activeTab !== 'info'"
            [class.hover:text-slate-900]="activeTab !== 'info'"
            (click)="activeTab = 'info'">
            Thông tin cá nhân
          </button>
          
          <button 
            class="px-2 py-4 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none"
            [class.border-primary]="activeTab === 'security'"
            [class.text-primary]="activeTab === 'security'"
            [class.border-transparent]="activeTab !== 'security'"
            [class.text-muted-foreground]="activeTab !== 'security'"
            [class.hover:text-slate-900]="activeTab !== 'security'"
            (click)="activeTab = 'security'">
            Bảo mật & Mật khẩu
          </button>
        </div>
      </z-card>

      <!-- Profile Content -->
      <div>
        <!-- Tab: Information -->
        <div *ngIf="activeTab === 'info'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <z-card>
            <div class="p-6">
              <div class="mb-6">
                <h3 class="text-lg font-medium">Thông tin cá nhân</h3>
                <p class="text-sm text-muted-foreground">Cập nhật thông tin hồ sơ của bạn.</p>
              </div>

              <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <z-form-field class="md:col-span-2">
                    <label z-form-label zRequired>Họ và tên</label>
                    <z-form-control>
                      <input z-input type="text" formControlName="full_name" placeholder="Nhập họ và tên" />
                    </z-form-control>
                    <div class="text-[0.8rem] font-medium text-destructive mt-1" *ngIf="profileForm.get('full_name')?.touched && profileForm.get('full_name')?.invalid">
                      Vui lòng nhập họ tên
                    </div>
                  </z-form-field>

                  <z-form-field>
                    <label z-form-label zRequired>Email</label>
                    <z-form-control>
                      <input z-input type="email" formControlName="email" placeholder="example@domain.com" />
                    </z-form-control>
                    <div class="text-[0.8rem] font-medium text-destructive mt-1" *ngIf="profileForm.get('email')?.touched && profileForm.get('email')?.invalid">
                      Email không hợp lệ
                    </div>
                  </z-form-field>

                  <z-form-field>
                    <label z-form-label zRequired>Số điện thoại</label>
                    <z-form-control>
                      <input z-input type="text" formControlName="phone_number" placeholder="09xx xxx xxx" />
                    </z-form-control>
                    <div class="text-[0.8rem] font-medium text-destructive mt-1" *ngIf="profileForm.get('phone_number')?.touched && profileForm.get('phone_number')?.invalid">
                      Số điện thoại không hợp lệ
                    </div>
                  </z-form-field>
                  
                </div>

                <div class="flex justify-end pt-4">
                  <button z-button [zDisabled]="profileForm.invalid || loading" type="submit">
                    {{ loading ? 'Đang lưu...' : 'Lưu thay đổi' }}
                  </button>
                </div>
              </form>
            </div>
          </z-card>
        </div>

        <!-- Tab: Security -->
        <div *ngIf="activeTab === 'security'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <z-card>
            <div class="p-6">
              <div class="mb-6">
                <h3 class="text-lg font-medium">Đổi mật khẩu</h3>
                <p class="text-sm text-muted-foreground">Hãy sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn.</p>
              </div>
              
              <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <z-form-field class="md:col-span-2">
                    <label z-form-label zRequired>Mật khẩu hiện tại</label>
                    <z-form-control>
                      <input z-input type="password" formControlName="oldPassword" placeholder="••••••••" />
                    </z-form-control>
                  </z-form-field>

                  <z-form-field>
                    <label z-form-label zRequired>Mật khẩu mới</label>
                    <z-form-control>
                      <input z-input type="password" formControlName="newPassword" placeholder="Tối thiểu 8 ký tự" />
                    </z-form-control>
                  </z-form-field>

                  <z-form-field>
                    <label z-form-label zRequired>Xác nhận mật khẩu mới</label>
                    <z-form-control>
                      <input z-input type="password" formControlName="confirmPassword" placeholder="Nhập lại mật khẩu mới" />
                    </z-form-control>
                    <div class="text-[0.8rem] font-medium text-destructive mt-1" *ngIf="passwordForm.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched">
                      Mật khẩu xác nhận không khớp
                    </div>
                  </z-form-field>

                </div>

                <div class="flex justify-end pt-4">
                  <button z-button [zDisabled]="passwordForm.invalid || loading" type="submit">
                    {{ loading ? 'Đang cập nhật...' : 'Đổi mật khẩu' }}
                  </button>
                </div>
              </form>
            </div>
          </z-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Any specific overrides can go here, but Tailwind classes cover everything */
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
      error: (err) => {
        console.error('Failed to load profile', err);
        toast.error('Không tải được tải thông tin hồ sơ.');
      }
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
        toast.success('Cập nhật hồ sơ thành công!');
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        toast.error('Có lỗi xảy ra khi cập nhật hồ sơ.');
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
        toast.success('Đổi mật khẩu thành công!');
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        toast.error(err.error?.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ.');
      }
    });
  }
}
