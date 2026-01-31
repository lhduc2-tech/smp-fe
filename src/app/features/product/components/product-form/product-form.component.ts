import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { ToastService } from '../../../../shared/components/toast/toast';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  form!: FormGroup;
  productId?: string;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      shopId: ['']
    });

    this.productId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.productId;

    if (this.isEdit) {
      this.productService.getProductById(this.productId!)
        .subscribe(res => this.form.patchValue(res));
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const action$ = this.isEdit
      ? this.productService.updateProduct({
          id: this.productId!,
          ...this.form.value
        })
      : this.productService.addProduct(this.form.value);

    action$.subscribe(() => {
      this.toast.success(
        this.isEdit ? 'Cập nhật thành công' : 'Thêm sản phẩm thành công'
      );
      this.router.navigate(['/products']);
    });
  }
}
