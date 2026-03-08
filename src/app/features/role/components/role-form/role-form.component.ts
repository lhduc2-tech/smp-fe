import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../../permission/services/permission.service';

import { Permission } from '../../../permission/models/permission.model';

import { toast } from 'ngx-sonner';

import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,  
    ReactiveFormsModule,
    RouterLink,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css']
})
export class RoleFormComponent implements OnInit {

  form!: FormGroup;

  roleId?: string;
  isEdit = false;
  isLoading = false;

  permissions: Permission[] = [];
  selectedPermissions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {

    this.initForm();
    this.resolveRoute();

    this.loadPermissions();
    this.loadRoleIfEdit();

  }

  /* ================= FORM ================= */

  private initForm(): void {

    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      status: ['ACTIVE']
    });

  }

  /* ================= ROUTE ================= */

  private resolveRoute(): void {

    this.roleId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEdit = !!this.roleId;

  }

  /* ================= LOAD PERMISSIONS ================= */

  private loadPermissions(): void {

    this.permissionService.getAllPermissions()
      .subscribe({

        next: res => {
          this.permissions = res;
        },

        error: () => {
          toast.error('Không tải được danh sách permission');
        }

      });

  }

  /* ================= LOAD ROLE ================= */

  private loadRoleIfEdit(): void {

    if (!this.isEdit || !this.roleId) return;

    this.isLoading = true;

    this.roleService.getRoleById(this.roleId)
      .subscribe({

        next: res => {

          this.form.patchValue({
            code: res.code,
            name: res.name,
            description: res.description,
            status: res.status
          });

          this.selectedPermissions = res.permissions || [];

        },

        error: () => {

          toast.error('Không tải được dữ liệu role');
          this.router.navigate(['/settings/roles']);

        },

        complete: () => {
          this.isLoading = false;
        }

      });

  }

  /* ================= TOGGLE PERMISSION ================= */

  togglePermission(permissionId: string, event: any): void {

    if (event.target.checked) {

      this.selectedPermissions.push(permissionId);

    } else {

      this.selectedPermissions =
        this.selectedPermissions.filter(p => p !== permissionId);

    }

  }

  /* ================= SUBMIT ================= */

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;

    this.isLoading = true;

    const action$ = this.isEdit && this.roleId
      ? this.roleService.updateRole(this.roleId, payload)
      : this.roleService.createRole(payload);

    action$.subscribe({

      next: (role) => {

        const roleId = this.isEdit ? this.roleId! : role.id;

        this.roleService.assignPermissions(
          roleId,
          this.selectedPermissions
        ).subscribe({

          next: () => {

            toast.success(
              this.isEdit
                ? 'Cập nhật role thành công'
                : 'Tạo role thành công'
            );

            this.router.navigate(['/settings/roles']);

          },

          error: () => {
            toast.error('Phân quyền thất bại');
          }

        });

      },

      error: () => {

        toast.error(
          this.isEdit
            ? 'Cập nhật role thất bại'
            : 'Tạo role thất bại'
        );

        this.isLoading = false;

      }

    });

  }

}