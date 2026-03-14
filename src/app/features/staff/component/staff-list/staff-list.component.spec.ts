import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { StaffListComponent } from './staff-list.component';
import { StaffService } from '../../services/staff.service';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';

describe('StaffListComponent', () => {
  let component: StaffListComponent;
  let staffServiceSpy: any;
  let confirmServiceSpy: any;

  beforeEach(async () => {
    staffServiceSpy = {
      getStaffPage: vi.fn().mockReturnValue(of({
        content: [{ id: '1', fullName: 'Staff A', email: 'a@test.com' }],
        page: 0, size: 10, total: 1, totalPages: 1
      })),
      deleteStaff: vi.fn().mockReturnValue(of(void 0))
    };
    confirmServiceSpy = { confirm: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [StaffListComponent],
      providers: [
        provideRouter([]),
        { provide: StaffService, useValue: staffServiceSpy },
        { provide: ConfirmService, useValue: confirmServiceSpy },
        { provide: ChangeDetectorRef, useValue: { detectChanges: vi.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(StaffListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load staff on init', () => {
    component.ngOnInit();
    expect(component.staffList.length).toBe(1);
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

  it('should update page size', () => {
    component.onPageSizeChange(20);
    expect(component.pageSize).toBe(20);
    expect(component.currentPage).toBe(0);
  });

  it('should delete staff', async () => {
    await component.deleteStaff('1');
    expect(confirmServiceSpy.confirm).toHaveBeenCalled();
    expect(staffServiceSpy.deleteStaff).toHaveBeenCalledWith('1');
  });

  it('should return page label', () => {
    expect(component.getPageLabel(0)).toBe('1');
    expect(component.getPageLabel('...')).toBe('...');
  });
});
