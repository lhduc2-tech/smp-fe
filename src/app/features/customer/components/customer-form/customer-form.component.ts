import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CustomerService } from '../../services/customer.service';
import { toast } from 'ngx-sonner';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  form!: FormGroup;
  customerId?: string;
  isEdit = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ================= INIT =================
  ngOnInit(): void {
    this.initForm();
    this.resolveRoute();
    this.loadCustomerIfEdit();
  }

  // ================= FORM =================
  private initForm(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(255)]],
      phoneNumber: ['', [Validators.maxLength(15)]],
      email: ['', [Validators.email, Validators.maxLength(255)]],
      address: ['', [Validators.maxLength(255)]]
    });
  }

  // ================= ROUTE =================
  private resolveRoute(): void {
    this.customerId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.customerId;
  }

  // ================= LOAD EDIT =================
  private loadCustomerIfEdit(): void {
    if (!this.isEdit || !this.customerId) return;

    this.isLoading = true;

    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (res) => {
        this.form.patchValue({
          fullName: res.fullName,
          phoneNumber: res.phoneNumber,
          email: res.email,
          address: res.address
        });
      },
      error: () => {
        toast.error('Không tải được dữ liệu khách hàng');
        this.router.navigate(['/customer']);
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

    const payload = {
      fullName: this.form.get('fullName')?.value,
      phoneNumber: this.form.get('phoneNumber')?.value,
      email: this.form.get('email')?.value,
      address: this.form.get('address')?.value
    };

    this.isLoading = true;

    const action$ = this.isEdit && this.customerId
      ? this.customerService.updateCustomer(this.customerId, payload)
      : this.customerService.addCustomer(payload);

    action$.subscribe({
      next: () => {
        toast.success(
          this.isEdit
            ? 'Cập nhật khách hàng thành công'
            : 'Thêm khách hàng thành công'
        );

        this.router.navigate(['/customers']);
      },
      error: () => {
        toast.error(
          this.isEdit
            ? 'Cập nhật khách hàng thất bại'
            : 'Thêm khách hàng thất bại'
        );
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}