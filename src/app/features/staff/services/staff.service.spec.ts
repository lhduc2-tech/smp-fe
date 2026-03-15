import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StaffService } from './staff.service';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

describe('StaffService', () => {
  let service: StaffService;
  let apiServiceSpy: any;

  beforeEach(() => {
    localStorage.clear();
    apiServiceSpy = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
    const authSpy = { shopId: 'shop-1', username: 'admin' };

    TestBed.configureTestingModule({
      providers: [
        StaffService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    });
    service = TestBed.inject(StaffService);
  });

  afterEach(() => localStorage.clear());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get staff page', () => {
    const mockRes = {
      content: [{ id: '1', full_name: 'Staff A', email: 'a@test.com', phone_number: '0123' }],
      page_number: 0, page_size: 10, total_elements: 1, total_pages: 1
    };
    apiServiceSpy.post.mockReturnValue(of(mockRes));

    service.getStaffPage({ page: 0, size: 10 }).subscribe(page => {
      expect(page.content.length).toBe(1);
      expect(page.content[0].fullName).toBe('Staff A');
    });
  });

  it('should get staff list', () => {
    const mockRes = {
      content: [{ id: '1', full_name: 'Staff A', email: 'a@test.com' }],
      page_number: 0, page_size: 10, total_elements: 1, total_pages: 1
    };
    apiServiceSpy.post.mockReturnValue(of(mockRes));

    service.getStaffList().subscribe(list => {
      expect(list.length).toBe(1);
    });
  });

  it('should add staff', () => {
    localStorage.setItem('username', 'admin');
    apiServiceSpy.post.mockReturnValue(of({ id: '2', full_name: 'New', email: 'new@test.com' }));

    service.addStaff({ fullName: 'New', email: 'new@test.com' }).subscribe(staff => {
      expect(staff.fullName).toBe('New');
    });
  });

  it('should update staff', () => {
    localStorage.setItem('username', 'admin');
    apiServiceSpy.put.mockReturnValue(of({ id: '1', full_name: 'Updated', email: 'u@test.com' }));

    service.updateStaff({ id: '1', fullName: 'Updated', email: 'u@test.com', phoneNumber: '0123' }).subscribe(staff => {
      expect(staff.fullName).toBe('Updated');
    });
  });

  it('should delete staff', () => {
    apiServiceSpy.delete.mockReturnValue(of(void 0));
    service.deleteStaff('1').subscribe();
    expect(apiServiceSpy.delete).toHaveBeenCalledWith('/private/api/v1/staffs/1');
  });

  it('should get staff by id', () => {
    apiServiceSpy.get.mockReturnValue(of({ id: '1', full_name: 'Staff A', email: 'a@test.com' }));

    service.getStaffById('1').subscribe(staff => {
      expect(staff.id).toBe('1');
    });
  });
});
