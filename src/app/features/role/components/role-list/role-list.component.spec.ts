import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { RoleListComponent } from './role-list.component';
import { RoleService } from '../../services/role.service';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';

describe('RoleListComponent', () => {
  let component: RoleListComponent;
  let roleServiceSpy: any;
  let confirmServiceSpy: any;

  beforeEach(async () => {
    roleServiceSpy = {
      searchRoles: vi.fn().mockReturnValue(of({
        content: [{ id: '1', code: 'ADMIN', name: 'Admin', status: 'ACTIVE' }],
        page: 0, size: 10, total: 1, totalPages: 1
      })),
      deleteRole: vi.fn().mockReturnValue(of(void 0))
    };
    confirmServiceSpy = { confirm: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [RoleListComponent],
      providers: [
        provideRouter([]),
        { provide: RoleService, useValue: roleServiceSpy },
        { provide: ConfirmService, useValue: confirmServiceSpy },
        { provide: ChangeDetectorRef, useValue: { detectChanges: vi.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(RoleListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load roles on init', () => {
    component.ngOnInit();
    expect(component.allRoles.length).toBe(1);
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

  it('should delete role', async () => {
    await component.deleteRole('1');
    expect(confirmServiceSpy.confirm).toHaveBeenCalled();
    expect(roleServiceSpy.deleteRole).toHaveBeenCalledWith('1');
  });

  it('should return page label', () => {
    expect(component.getPageLabel(0)).toBe('1');
    expect(component.getPageLabel('...')).toBe('...');
  });
});
