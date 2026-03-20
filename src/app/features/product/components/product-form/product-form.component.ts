import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../category/services/cate.service';
import { Category } from '../../../category/models/cate.model';
import { toast } from 'ngx-sonner';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  form!: FormGroup;
  productId?: string;
  isEdit = false;
  categories: Category[] = [];

  private categoryService = inject(CategoryService);

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      code: [''],
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1000), Validators.max(999999999)]],
      categoryId: ['', Validators.required],
    });

    this.loadCategories();

    this.productId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.productId;

    if (this.isEdit) {
      this.productService.getProductById(this.productId!)
        .subscribe(res => {
          this.form.patchValue(res);
        });
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        toast.error('Lỗi khi tải danh sách danh mục');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const action$ = this.isEdit
      ? this.productService.updateProduct({
        id: this.productId!,
        ...this.form.value
      })
      : this.productService.addProduct(this.form.value);

    action$.subscribe({
      next: (res) => {
        toast.success(
          this.isEdit ? 'Cập nhật thành công' : 'Thêm sản phẩm thành công'
        );
        if (!this.isEdit) {
          this.router.navigate(['/products']);
        }
      },
      error: () => {
        toast.error('Có lỗi xảy ra!');
      }
    });
  }
}
