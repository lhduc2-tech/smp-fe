import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { PermissionFormComponent } from './permission-form.component';
import { PermissionService } from '../../services/permission.service';

describe('PermissionFormComponent', () => {
  let component: PermissionFormComponent;
  let permissionServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    permissionServiceSpy = {
      createPermission: vi.fn().mockReturnValue(of({})),
      updatePermission: vi.fn().mockReturnValue(of({})),
      getPermissionById: vi.fn().mockReturnValue(of({ code: 'READ', description: 'Read access' }))
    };

    await TestBed.configureTestingModule({
      imports: [PermissionFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
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

    const fixture = TestBed.createComponent(PermissionFormComponent);
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

  it('should require code', () => {
    expect(component.form.get('code')?.hasError('required')).toBe(true);
  });

  it('should not submit when invalid', () => {
    component.submit();
    expect(permissionServiceSpy.createPermission).not.toHaveBeenCalled();
  });

  it('should call createPermission on valid submit', () => {
    component.form.patchValue({ code: 'WRITE' });
    component.submit();
    expect(permissionServiceSpy.createPermission).toHaveBeenCalled();
  });
});
