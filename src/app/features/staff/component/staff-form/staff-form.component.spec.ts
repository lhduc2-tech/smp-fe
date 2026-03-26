import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StaffFormComponent } from './staff-form.component';
import { StaffService } from '../../services/staff.service';

describe.skip('StaffFormComponent', () => {
  let component: StaffFormComponent;
  let staffServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    staffServiceSpy = {
      addStaff: vi.fn().mockReturnValue(of({})),
      updateStaff: vi.fn().mockReturnValue(of({})),
      getStaffById: vi.fn().mockReturnValue(of({ fullName: 'Test', email: 'test@test.com', phoneNumber: '0123', status: 'ACTIVE', position: 'STAFF' }))
    };

    await TestBed.configureTestingModule({
      imports: [StaffFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: StaffService, useValue: staffServiceSpy },
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

    const fixture = TestBed.createComponent(StaffFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(async () => true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be in create mode', () => {
    expect(component.isEdit).toBe(false);
  });

  it('should require fullName', () => {
    expect(component.staffForm.get('fullName')?.hasError('required')).toBe(true);
  });

  it('should require email', () => {
    expect(component.staffForm.get('email')?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    component.staffForm.patchValue({ email: 'invalid' });
    expect(component.staffForm.get('email')?.hasError('email')).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component.submitForm();
    expect(staffServiceSpy.addStaff).not.toHaveBeenCalled();
  });

  it('should call addStaff on valid submit', () => {
    component.staffForm.patchValue({
      fullName: 'Test', email: 'test@test.com', phoneNumber: '0123',
      status: 'ACTIVE', position: 'STAFF'
    });
    component.submitForm();
    expect(staffServiceSpy.addStaff).toHaveBeenCalled();
  });

  it('should set loading on submit', () => {
    component.staffForm.patchValue({
      fullName: 'Test', email: 'test@test.com', phoneNumber: '0123',
      status: 'ACTIVE', position: 'STAFF'
    });
    component.submitForm();
    expect(component.isLoading).toBe(true);
  });
});
