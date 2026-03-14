import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { SupplierListComponent } from './supplier-list.component';
import { SupplierService } from '../../services/supplier.service';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';

describe('SupplierListComponent', () => {
  let component: SupplierListComponent;
  let supplierServiceSpy: any;
  let confirmServiceSpy: any;

  beforeEach(async () => {
    supplierServiceSpy = {
      getSupplierPage: vi.fn().mockReturnValue(of({
        content: [{ id: '1', supplierName: 'Sup1' }],
        page: 0, size: 10, total: 1, totalPages: 1
      })),
      deleteSupplier: vi.fn().mockReturnValue(of(void 0))
    };
    confirmServiceSpy = { confirm: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [SupplierListComponent],
      providers: [
        provideRouter([]),
        { provide: SupplierService, useValue: supplierServiceSpy },
        { provide: ConfirmService, useValue: confirmServiceSpy },
        { provide: ChangeDetectorRef, useValue: { detectChanges: vi.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(SupplierListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load suppliers on init', () => {
    component.ngOnInit();
    expect(component.suppliers.length).toBe(1);
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

  it('should delete supplier', async () => {
    await component.deleteSupplier('1');
    expect(confirmServiceSpy.confirm).toHaveBeenCalled();
    expect(supplierServiceSpy.deleteSupplier).toHaveBeenCalledWith('1');
  });
});
