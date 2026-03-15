import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let productServiceSpy: any;
  let confirmServiceSpy: any;

  beforeEach(async () => {
    productServiceSpy = {
      getAllProductByShopId: vi.fn().mockReturnValue(of([
        { id: '1', code: 'P001', name: 'Product 1', price: 10000 },
        { id: '2', code: 'P002', name: 'Product 2', price: 20000 }
      ])),
      deleteProduct: vi.fn().mockReturnValue(of(void 0))
    };
    confirmServiceSpy = { confirm: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: productServiceSpy },
        { provide: ConfirmService, useValue: confirmServiceSpy },
        { provide: ChangeDetectorRef, useValue: { detectChanges: vi.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    component.ngOnInit();
    expect(productServiceSpy.getAllProductByShopId).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
  });

  it('should reset page on search', () => {
    component.currentPage = 3;
    component.onSearch();
    expect(component.currentPage).toBe(0);
  });

  it('should not change page when out of bounds', () => {
    component.totalPages = 3;
    component.currentPage = 0;
    component.onPageChange(-1);
    expect(component.currentPage).toBe(0);

    component.onPageChange(3);
    expect(component.currentPage).toBe(0);
  });

  it('should change page within bounds', () => {
    component.totalPages = 3;
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
  });

  it('should update page size', () => {
    component.totalElements = 30;
    component.onPageSizeChange(20);
    expect(component.pageSize).toBe(20);
    expect(component.currentPage).toBe(0);
    expect(component.totalPages).toBe(2);
  });

  it('should return correct page label', () => {
    expect(component.getPageLabel(0)).toBe('1');
    expect(component.getPageLabel(4)).toBe('5');
    expect(component.getPageLabel('...')).toBe('...');
  });

  it('should delete product with confirmation', async () => {
    component.ngOnInit();
    await component.deleteProduct('1');
    expect(confirmServiceSpy.confirm).toHaveBeenCalled();
    expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith('1');
  });
});
