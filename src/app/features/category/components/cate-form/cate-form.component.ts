import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CategoryService } from '../../services/cate.service';
import { ToastService } from '../../../../shared/components/toast/toast';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './cate-form.component.html',
  styleUrls: ['./cate-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  form!: FormGroup;
  categoryId?: string;
  isEdit = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.initForm();
    this.resolveRoute();
    this.loadCategoryIfEdit();
  }

  // ================= FORM =================
  private initForm(): void {
    this.form = this.fb.group({
      categoryName: ['', [Validators.required, Validators.maxLength(255)]],
      categoryDescription: ['']
    });
  }

  // ================= ROUTE =================
  private resolveRoute(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.categoryId;
  }

  // ================= LOAD EDIT =================
  private loadCategoryIfEdit(): void {
    if (!this.isEdit || !this.categoryId) return;

    this.isLoading = true;

    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (res) => {
        this.form.patchValue({
          categoryName: res.categoryName,
          categoryDescription: res.categoryDescription
        });
      },
      error: () => {
        this.toast.error('Không tải được dữ liệu danh mục');
        this.router.navigate(['/categories']);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // ================= SUBMIT =================
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const shopId = this.authService.shopId;

    if (!shopId) {
      this.toast.error('Không tìm thấy thông tin cửa hàng');
      return;
    }

    const payload = {
      categoryName: this.form.get('categoryName')?.value,
      categoryDescription: this.form.get('categoryDescription')?.value,
      shopId: shopId
    };

    this.isLoading = true;

    const action$ = this.isEdit && this.categoryId
      ? this.categoryService.updateCategory(this.categoryId, payload)
      : this.categoryService.addCategory(payload);

    action$.subscribe({
      next: () => {
        this.toast.success(
          this.isEdit
            ? 'Cập nhật danh mục thành công'
            : 'Thêm danh mục thành công'
        );
        this.router.navigate(['/categories']);
      },
      error: () => {
        this.toast.error(
          this.isEdit
            ? 'Cập nhật danh mục thất bại'
            : 'Thêm danh mục thất bại'
        );
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}