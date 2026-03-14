import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return token from localStorage', () => {
    localStorage.setItem('access_token', 'test-token');
    expect(service.token).toBe('test-token');
  });

  it('should return null when no token', () => {
    expect(service.token).toBeNull();
  });

  it('should return username from localStorage', () => {
    localStorage.setItem('username', 'admin');
    expect(service.username).toBe('admin');
  });

  it('should return userId from localStorage', () => {
    localStorage.setItem('user_id', 'u123');
    expect(service.userId).toBe('u123');
  });

  it('should return shopId from localStorage', () => {
    localStorage.setItem('shop_id', 's123');
    expect(service.shopId).toBe('s123');
  });

  it('should return roles from localStorage', () => {
    localStorage.setItem('roles', JSON.stringify(['ADMIN', 'USER']));
    expect(service.roles).toEqual(['ADMIN', 'USER']);
  });

  it('should return empty array when no roles', () => {
    expect(service.roles).toEqual([]);
  });

  it('should return permissions from localStorage', () => {
    localStorage.setItem('permissions', JSON.stringify(['READ', 'WRITE']));
    expect(service.permissions).toEqual(['READ', 'WRITE']);
  });

  it('should check hasRole correctly', () => {
    localStorage.setItem('roles', JSON.stringify(['ADMIN']));
    expect(service.hasRole('ADMIN')).toBe(true);
    expect(service.hasRole('USER')).toBe(false);
  });

  it('should check hasPermission correctly', () => {
    localStorage.setItem('permissions', JSON.stringify(['READ']));
    expect(service.hasPermission('READ')).toBe(true);
    expect(service.hasPermission('WRITE')).toBe(false);
  });

  it('should return true for expired/missing token', () => {
    expect(service.isTokenExpired()).toBe(true);
  });

  it('should return true for invalid token', () => {
    expect(service.isTokenExpired('invalid-token')).toBe(true);
  });

  it('should return false for isAuthenticated when no token', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should call register endpoint', () => {
    const request = {
      username: 'test',
      email: 'test@test.com',
      phoneNumber: '0123',
      shopName: 'Shop',
      address: 'Addr',
      shopType: '',
      password: '123456'
    };

    service.register(request).subscribe();

    const req = httpMock.expectOne(r => r.url.includes('/register'));
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should clear localStorage on logout', () => {
    localStorage.setItem('access_token', 'token');
    localStorage.setItem('username', 'admin');
    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();

    const req = httpMock.expectOne(r => r.url.includes('/logout'));
    req.flush({});
  });
});
