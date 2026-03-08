import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PermissionService } from '../../services/permission.service';

import { toast } from 'ngx-sonner';

import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

@Component({
  selector: 'app-permission-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.css']
})
export class PermissionFormComponent implements OnInit {

  form!: FormGroup;

  permissionId?: string;
  isEdit = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.initForm();
    this.resolveRoute();
    this.loadPermissionIfEdit();
  }

  /* ================= FORM ================= */

  private initForm(): void {

    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['']
    });

  }

  /* ================= ROUTE ================= */

  private resolveRoute(): void {

    this.permissionId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.permissionId;

  }

  /* ================= LOAD EDIT ================= */

  private loadPermissionIfEdit(): void {

    if (!this.isEdit || !this.permissionId) return;

    this.isLoading = true;

    this.permissionService.getPermissionById(this.permissionId)
      .subscribe({

        next: (res) => {

          this.form.patchValue({
            code: res.code,
            description: res.description
          });

        },

        error: () => {

          toast.error('Không tải được dữ liệu permission');
          this.router.navigate(['/permissions']);

        },

        complete: () => {
          this.isLoading = false;
        }

      });

  }

  /* ================= SUBMIT ================= */

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      code: this.form.get('code')?.value,
      description: this.form.get('description')?.value
    };

    this.isLoading = true;

    const action$ = this.isEdit && this.permissionId
      ? this.permissionService.updatePermission(this.permissionId, payload)
      : this.permissionService.createPermission(payload);

    action$.subscribe({

      next: () => {

        toast.success(
          this.isEdit
            ? 'Cập nhật permission thành công'
            : 'Thêm permission thành công'
        );

        if (!this.isEdit) {
          this.router.navigate(['/permissions']);
        }

      },

      error: () => {

        toast.error(
          this.isEdit
            ? 'Cập nhật permission thất bại'
            : 'Thêm permission thất bại'
        );

      },

      complete: () => {
        this.isLoading = false;
      }

    });

  }

}