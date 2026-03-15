import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { ProfileService } from '../../services/profile.service';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false, media: query, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

describe.skip('ProfileComponent', () => {
  let component: ProfileComponent;
  let profileServiceSpy: any;

  beforeEach(async () => {
    profileServiceSpy = {
      getProfile: vi.fn().mockReturnValue(of({
        id: '1', username: 'admin', email: 'a@test.com',
        phone_number: '0123', status: 'ACTIVE', full_name: 'Admin', roles: ['ADMIN']
      })),
      updateProfile: vi.fn().mockReturnValue(of({
        id: '1', username: 'admin', email: 'u@test.com',
        phone_number: '0456', status: 'ACTIVE', full_name: 'Updated', roles: ['ADMIN']
      })),
      changePassword: vi.fn().mockReturnValue(of(void 0))
    };

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile on init', () => {
    expect(profileServiceSpy.getProfile).toHaveBeenCalled();
    expect(component.profile?.username).toBe('admin');
  });

  it('should populate profile form', () => {
    expect(component.profileForm.get('full_name')?.value).toBe('Admin');
    expect(component.profileForm.get('email')?.value).toBe('a@test.com');
  });

  it('should default to info tab', () => {
    expect(component.activeTab).toBe('info');
  });

  it('should validate profile form', () => {
    component.profileForm.patchValue({ full_name: '' });
    expect(component.profileForm.get('full_name')?.hasError('required')).toBe(true);
  });

  it('should not update profile when form is invalid', () => {
    component.profileForm.patchValue({ full_name: '' });
    component.onUpdateProfile();
    expect(profileServiceSpy.updateProfile).not.toHaveBeenCalled();
  });

  it('should update profile on valid submit', () => {
    component.onUpdateProfile();
    expect(profileServiceSpy.updateProfile).toHaveBeenCalled();
  });

  it('should validate password mismatch', () => {
    component.passwordForm.patchValue({
      oldPassword: 'old', newPassword: '12345678', confirmPassword: 'different'
    });
    expect(component.passwordForm.hasError('mismatch')).toBe(true);
  });

  it('should change password on valid submit', () => {
    component.passwordForm.patchValue({
      oldPassword: 'old', newPassword: '12345678', confirmPassword: '12345678'
    });
    component.onChangePassword();
    expect(profileServiceSpy.changePassword).toHaveBeenCalled();
  });

  it('should not change password when form is invalid', () => {
    component.onChangePassword();
    expect(profileServiceSpy.changePassword).not.toHaveBeenCalled();
  });
});
