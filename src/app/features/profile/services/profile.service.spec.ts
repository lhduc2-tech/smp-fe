import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get profile', () => {
    const mockProfile = { id: '1', username: 'admin', email: 'a@test.com', phone_number: '0123', status: 'ACTIVE', full_name: 'Admin', roles: ['ADMIN'] };

    service.getProfile().subscribe(profile => {
      expect(profile.username).toBe('admin');
      expect(profile.full_name).toBe('Admin');
    });

    const req = httpMock.expectOne(r => r.url.includes('/me'));
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);
  });

  it('should update profile', () => {
    const updateReq = { fullName: 'Updated', email: 'u@test.com', phoneNumber: '0456' };
    const mockRes = { id: '1', username: 'admin', full_name: 'Updated', email: 'u@test.com', phone_number: '0456', status: 'ACTIVE', roles: ['ADMIN'] };

    service.updateProfile(updateReq).subscribe(profile => {
      expect(profile.full_name).toBe('Updated');
    });

    const req = httpMock.expectOne(r => r.url.includes('/me') && !r.url.includes('/password'));
    expect(req.request.method).toBe('PUT');
    req.flush(mockRes);
  });

  it('should change password', () => {
    const pwReq = { password: 'newPassword123' };

    service.changePassword(pwReq).subscribe();

    const req = httpMock.expectOne(r => r.url.includes('/me'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ password: 'newPassword123' });
    req.flush({ id: '1', username: 'admin', email: 'a@test.com', phone_number: '0123', status: 'ACTIVE', full_name: 'Admin', roles: ['ADMIN'] });
  });
});
