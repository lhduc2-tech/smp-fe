import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CategoryListComponent } from './cate-list.component';
import { CategoryService } from '../../services/cate.service';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let categoryServiceSpy: any;
  let confirmServiceSpy: any;

  beforeEach(async () => {
    categoryServiceSpy = {
      getCategoryPage: vi.fn().mockReturnValue(of({
        content: [{ id: '1', categoryName: 'Cat1' }],
        page: 0, size: 10, total: 1, totalPages: 1
      })),
      deleteCategory: vi.fn().mockReturnValue(of(void 0))
    };
    confirmServiceSpy = { confirm: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        provideRouter([]),
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: ConfirmService, useValue: confirmServiceSpy },
        { provide: ChangeDetectorRef, useValue: { detectChanges: vi.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    component.ngOnInit();
    expect(component.categories.length).toBe(1);
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

  it('should delete category', async () => {
    component.ngOnInit();
    await component.deleteCategory('1');
    expect(confirmServiceSpy.confirm).toHaveBeenCalled();
    expect(categoryServiceSpy.deleteCategory).toHaveBeenCalledWith('1');
  });

  it('should return correct page label', () => {
    expect(component.getPageLabel(0)).toBe('1');
    expect(component.getPageLabel('...')).toBe('...');
  });
});
