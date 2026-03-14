import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { PermissionListComponent } from './permission-list.component';
import { PermissionService } from '../../services/permission.service';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';

describe('PermissionListComponent', () => {
  let component: PermissionListComponent;
  let permissionServiceSpy: any;
  let confirmServiceSpy: any;

  beforeEach(async () => {
    permissionServiceSpy = {
      getAllPermissions: vi.fn().mockReturnValue(of([
        { id: '1', code: 'READ', description: 'Read' },
        { id: '2', code: 'WRITE', description: 'Write' }
      ])),
      deletePermission: vi.fn().mockReturnValue(of(void 0))
    };
    confirmServiceSpy = { confirm: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [PermissionListComponent],
      providers: [
        provideRouter([]),
        { provide: PermissionService, useValue: permissionServiceSpy },
        { provide: ConfirmService, useValue: confirmServiceSpy },
        { provide: ChangeDetectorRef, useValue: { detectChanges: vi.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(PermissionListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load permissions on init', () => {
    component.ngOnInit();
    expect(component.allPermissions.length).toBe(2);
  });

  it('should reset page on search', () => {
    component.currentPage = 2;
    component.onSearch();
    expect(component.currentPage).toBe(0);
  });

  it('should handle page change', () => {
    component.totalPages = 5;
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
  });

  it('should not change to invalid page', () => {
    component.totalPages = 3;
    component.onPageChange(-1);
    expect(component.currentPage).toBe(0);
  });

  it('should delete permission', async () => {
    await component.deletePermission('1');
    expect(confirmServiceSpy.confirm).toHaveBeenCalled();
    expect(permissionServiceSpy.deletePermission).toHaveBeenCalledWith('1');
  });

  it('should return page label', () => {
    expect(component.getPageLabel(0)).toBe('1');
    expect(component.getPageLabel('...')).toBe('...');
  });
});
