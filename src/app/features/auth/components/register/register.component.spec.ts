import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let authServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = { register: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(async () => true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('should validate password mismatch', () => {
    component.form.patchValue({
      username: 'test', email: 'test@test.com', phoneNumber: '0123',
      shopName: 'Shop', address: 'Addr', password: '123456',
      confirmPassword: 'different'
    });
    expect(component.form.hasError('passwordMismatch')).toBe(true);
  });

  it('should be valid with matching passwords', () => {
    component.form.patchValue({
      username: 'test', email: 'test@test.com', phoneNumber: '0123',
      shopName: 'Shop', address: 'Addr', password: '123456',
      confirmPassword: '123456'
    });
    expect(component.form.valid).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component.submit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call register on valid submit', () => {
    component.form.patchValue({
      username: 'test', email: 'test@test.com', phoneNumber: '0123',
      shopName: 'Shop', address: 'Addr', password: '123456',
      confirmPassword: '123456'
    });
    authServiceSpy.register.mockReturnValue(of({}));

    component.submit();
    expect(authServiceSpy.register).toHaveBeenCalled();
  });

  it('should navigate to login on successful register', () => {
    component.form.patchValue({
      username: 'test', email: 'test@test.com', phoneNumber: '0123',
      shopName: 'Shop', address: 'Addr', password: '123456',
      confirmPassword: '123456'
    });
    authServiceSpy.register.mockReturnValue(of({}));

    component.submit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set loading false on error', () => {
    component.form.patchValue({
      username: 'test', email: 'test@test.com', phoneNumber: '0123',
      shopName: 'Shop', address: 'Addr', password: '123456',
      confirmPassword: '123456'
    });
    authServiceSpy.register.mockReturnValue(throwError(() => new Error('fail')));

    component.submit();
    expect(component.loading).toBe(false);
  });
});
