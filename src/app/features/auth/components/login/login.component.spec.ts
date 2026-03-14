import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { GoogleAuthService } from '../../services/google-auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authServiceSpy: any;
  let googleAuthSpy: any;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = {
      login: vi.fn(),
      isAuthenticated: vi.fn().mockReturnValue(false)
    };
    googleAuthSpy = {
      initialize: vi.fn().mockResolvedValue(undefined),
      renderButton: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: GoogleAuthService, useValue: googleAuthSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
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

  it('should be valid when username and password are provided', () => {
    component.form.patchValue({ username: 'admin', password: '123456' });
    expect(component.form.valid).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component.submit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call login on valid submit', () => {
    component.form.patchValue({ username: 'admin', password: '123456' });
    authServiceSpy.login.mockReturnValue(of({}));

    component.submit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ username: 'admin', password: '123456' });
  });

  it('should navigate to dashboard on successful login', () => {
    component.form.patchValue({ username: 'admin', password: '123456' });
    authServiceSpy.login.mockReturnValue(of({}));

    component.submit();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set loading to false on login error', () => {
    component.form.patchValue({ username: 'admin', password: '123456' });
    authServiceSpy.login.mockReturnValue(throwError(() => new Error('fail')));

    component.submit();

    expect(component.loading).toBe(false);
  });
});
