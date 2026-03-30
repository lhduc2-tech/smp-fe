import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SupplierService } from '../../services/supplier.service';
import { toast } from 'ngx-sonner';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent implements OnInit {

  form!: FormGroup;
  supplierId?: string;
  isEdit = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.initForm();
    this.resolveRoute();
    this.loadSupplierIfEdit();
  }

  // ================= FORM =================
  private initForm(): void {
    this.form = this.fb.group({
      supplierName: ['', [Validators.required, Validators.maxLength(255)]],
      code: ['', [Validators.maxLength(50)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.email, Validators.maxLength(255)]],
      website: ['', [Validators.maxLength(255)]],
      taxCode: ['', [Validators.maxLength(20)]]
    });
  }

  // ================= ROUTE =================
  private resolveRoute(): void {
    this.supplierId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.supplierId;
    
    // Nếu là chế độ chỉnh sửa, không cho phép sửa mã nhà cung cấp
    if (this.isEdit) {
      const codeControl = this.form.get('code');
      codeControl?.disable();
    }
  }

  // ================= LOAD EDIT =================
  private loadSupplierIfEdit(): void {
    if (!this.isEdit || !this.supplierId) return;

    this.isLoading = true;

    this.supplierService.getSupplierById(this.supplierId).subscribe({
      next: (res) => {
        this.form.patchValue({
          supplierName: res.supplierName,
          code: res.code,
          phoneNumber: res.phoneNumber,
          email: res.email,
          website: res.website,
          taxCode: res.taxCode
        });
      },
      error: () => {
        toast.error('Không tải được dữ liệu nhà cung cấp');
        this.router.navigate(['/supplier']);
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

    const codeValue = this.form.get('code')?.value?.trim();
    const payload: any = {
      supplierName: this.form.get('supplierName')?.value,
      phoneNumber: this.form.get('phoneNumber')?.value,
      email: this.form.get('email')?.value,
      website: this.form.get('website')?.value,
      taxCode: this.form.get('taxCode')?.value
    };

    // Chỉ gửi code nếu người dùng nhập, nếu bỏ trống thì backend tự sinh
    if (codeValue) {
      payload.code = codeValue;
    }

    this.isLoading = true;

    const action$ = this.isEdit && this.supplierId
      ? this.supplierService.updateSupplier(this.supplierId, payload)
      : this.supplierService.addSupplier(payload);

    action$.subscribe({
      next: () => {
        toast.success(
          this.isEdit
            ? 'Cập nhật nhà cung cấp thành công'
            : 'Thêm nhà cung cấp thành công'
        );

        if (!this.isEdit) {
          this.router.navigate(['/supplier']);
        }
      },
      error: () => {
        toast.error(
          this.isEdit
            ? 'Cập nhật nhà cung cấp thất bại'
            : 'Thêm nhà cung cấp thất bại'
        );
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}