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

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      categoryName: ['', [Validators.required, Validators.maxLength(255)]],
      categoryDescription: ['']
    });

    this.categoryId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.categoryId;

    if (this.isEdit) {
      this.categoryService
        .getCategoryById(this.categoryId!)
        .subscribe(res => {
          this.form.patchValue({
            categoryName: res.categoryName,
            categoryDescription: res.categoryDescription
          });
        });
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const action$ = this.isEdit
      ? this.categoryService.updateCategory(
          this.categoryId!,
          this.form.value
        )
      : this.categoryService.addCategory(this.form.value);

    action$.subscribe(() => {
      this.toast.success(
        this.isEdit
          ? 'Cập nhật danh mục thành công'
          : 'Thêm danh mục thành công'
      );
      this.router.navigate(['/categories']);
    });
  }
}
