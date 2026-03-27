import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';

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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {

    this.initForm();
    this.resolveRoute();
    this.loadData();

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

  /* ================= LOAD DATA ================= */

  private loadData(): void {

    this.isLoading = true;

    const permissions$ = this.permissionService.getAllPermissions();
    const role$ = this.isEdit && this.roleId 
      ? this.roleService.getRoleById(this.roleId)
      : of(null);

    forkJoin([permissions$, role$]).subscribe({

      next: ([allPermissions, role]) => {

        this.permissions = allPermissions;

        if (role) {
          this.form.patchValue({
            code: role.code,
            name: role.name,
            description: role.description,
            status: role.status
          });

          // Map codes to IDs for selection
          if (role.permissions) {
            this.selectedPermissions = allPermissions
              .filter(p => role.permissions?.includes(p.code))
              .map(p => p.id);
          }
        }

        this.isLoading = false;
        this.cdr.detectChanges();

      },

      error: (err) => {
        console.error('Error loading role data:', err);
        toast.error('Không tải được dữ liệu');
        this.isLoading = false;
        this.cdr.detectChanges();
        if (this.isEdit) {
          this.router.navigate(['/settings/roles']);
        }
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