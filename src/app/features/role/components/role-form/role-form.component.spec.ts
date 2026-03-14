import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { RoleFormComponent } from './role-form.component';
import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../../permission/services/permission.service';

describe('RoleFormComponent', () => {
  let component: RoleFormComponent;
  let roleServiceSpy: any;
  let permissionServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    roleServiceSpy = {
      createRole: vi.fn().mockReturnValue(of({ id: '1' })),
      updateRole: vi.fn().mockReturnValue(of({ id: '1' })),
      getRoleById: vi.fn().mockReturnValue(of({ code: 'ADMIN', name: 'Admin', description: '', status: 'ACTIVE', permissions: [] })),
      assignPermissions: vi.fn().mockReturnValue(of(void 0))
    };
    permissionServiceSpy = {
      getAllPermissions: vi.fn().mockReturnValue(of([{ id: 'p1', code: 'READ' }]))
    };

    await TestBed.configureTestingModule({
      imports: [RoleFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: RoleService, useValue: roleServiceSpy },
        { provide: PermissionService, useValue: permissionServiceSpy },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { paramMap: { get: () => null } },
            params: of({}), paramMap: of({ get: () => null }), queryParamMap: of({ get: () => null })
          } 
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(RoleFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(async () => true);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be in create mode', () => {
    expect(component.isEdit).toBe(false);
  });

  it('should load permissions', () => {
    expect(component.permissions.length).toBe(1);
  });

  it('should toggle permission', () => {
    component.togglePermission('p1', { target: { checked: true } });
    expect(component.selectedPermissions).toContain('p1');

    component.togglePermission('p1', { target: { checked: false } });
    expect(component.selectedPermissions).not.toContain('p1');
  });

  it('should not submit when form is invalid', () => {
    component.submit();
    expect(roleServiceSpy.createRole).not.toHaveBeenCalled();
  });

  it('should submit and assign permissions', () => {
    component.form.patchValue({ code: 'USER', name: 'User' });
    component.selectedPermissions = ['p1'];
    component.submit();
    expect(roleServiceSpy.createRole).toHaveBeenCalled();
  });
});
