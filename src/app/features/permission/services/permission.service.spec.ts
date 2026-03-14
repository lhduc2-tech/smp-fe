import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PermissionService } from './permission.service';
import { ApiService } from '../../../core/services/api.service';

describe('PermissionService', () => {
  let service: PermissionService;
  let apiServiceSpy: any;

  beforeEach(() => {
    apiServiceSpy = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        PermissionService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });
    service = TestBed.inject(PermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all permissions', () => {
    const mockRes = [{ id: '1', code: 'READ', description: 'Read access', created_at: '', updated_at: '' }];
    apiServiceSpy.get.mockReturnValue(of(mockRes));

    service.getAllPermissions().subscribe(perms => {
      expect(perms.length).toBe(1);
      expect(perms[0].code).toBe('READ');
    });
  });

  it('should get permission by id', () => {
    apiServiceSpy.get.mockReturnValue(of({ id: '1', code: 'READ', description: 'Read' }));

    service.getPermissionById('1').subscribe(perm => {
      expect(perm.code).toBe('READ');
    });
  });

  it('should create permission', () => {
    apiServiceSpy.post.mockReturnValue(of({ id: '2', code: 'WRITE', description: 'Write' }));

    service.createPermission({ code: 'WRITE', description: 'Write' }).subscribe(perm => {
      expect(perm.id).toBe('2');
    });
  });

  it('should update permission', () => {
    apiServiceSpy.put.mockReturnValue(of({ id: '1', code: 'READ_WRITE', description: 'Updated' }));

    service.updatePermission('1', { code: 'READ_WRITE', description: 'Updated' }).subscribe(perm => {
      expect(perm.code).toBe('READ_WRITE');
    });
  });

  it('should delete permission', () => {
    apiServiceSpy.delete.mockReturnValue(of(void 0));
    service.deletePermission('1').subscribe();
    expect(apiServiceSpy.delete).toHaveBeenCalledWith('/private/api/v1/permissions/1');
  });
});
