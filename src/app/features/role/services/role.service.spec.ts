import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RoleService } from './role.service';
import { ApiService } from '../../../core/services/api.service';

describe('RoleService', () => {
  let service: RoleService;
  let apiServiceSpy: any;

  beforeEach(() => {
    apiServiceSpy = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        RoleService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });
    service = TestBed.inject(RoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search roles', () => {
    const mockRes = {
      content: [{ id: '1', code: 'ADMIN', name: 'Admin', description: '', status: 'ACTIVE', permissions: [], createdAt: '', updatedAt: '' }],
      page: 0, size: 10, total: 1, totalPages: 1
    };
    apiServiceSpy.post.mockReturnValue(of(mockRes));

    service.searchRoles({ page: 0, size: 10, sortBy: 'createdAt', sortDir: 'desc' }).subscribe(page => {
      expect(page.content.length).toBe(1);
      expect(page.content[0].code).toBe('ADMIN');
    });
  });

  it('should get role by id', () => {
    const mockRes = { id: '1', code: 'ADMIN', name: 'Admin', description: '', status: 'ACTIVE', permissions: [], createdAt: '', updatedAt: '' };
    apiServiceSpy.get.mockReturnValue(of(mockRes));

    service.getRoleById('1').subscribe(role => {
      expect(role.code).toBe('ADMIN');
    });
  });

  it('should create role', () => {
    const mockRes = { id: '2', code: 'USER', name: 'User', description: '', status: 'ACTIVE', permissions: [], createdAt: '', updatedAt: '' };
    apiServiceSpy.post.mockReturnValue(of(mockRes));

    service.createRole({ code: 'USER', name: 'User' }).subscribe(role => {
      expect(role.id).toBe('2');
    });
  });

  it('should update role', () => {
    const mockRes = { id: '1', code: 'ADMIN', name: 'Super Admin', description: '', status: 'ACTIVE', permissions: [], createdAt: '', updatedAt: '' };
    apiServiceSpy.put.mockReturnValue(of(mockRes));

    service.updateRole('1', { code: 'ADMIN', name: 'Super Admin' }).subscribe(role => {
      expect(role.name).toBe('Super Admin');
    });
  });

  it('should delete role', () => {
    apiServiceSpy.delete.mockReturnValue(of(void 0));
    service.deleteRole('1').subscribe();
    expect(apiServiceSpy.delete).toHaveBeenCalledWith('/private/api/v1/roles/1');
  });

  it('should assign permissions', () => {
    apiServiceSpy.post.mockReturnValue(of(void 0));
    service.assignPermissions('1', ['perm-1', 'perm-2']).subscribe();
    expect(apiServiceSpy.post).toHaveBeenCalledWith('/private/api/v1/roles/1/permissions', { permissionIds: ['perm-1', 'perm-2'] });
  });
});
