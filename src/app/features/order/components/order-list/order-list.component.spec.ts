import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { OrderListComponent } from './order-list.component';
import { OrderService } from '../../services/order.service';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { OrderPaymentService } from '../order-payment/order-payment-dialog.component';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let orderServiceSpy: any;
  let confirmServiceSpy: any;
  let paymentServiceSpy: any;

  beforeEach(async () => {
    orderServiceSpy = {
      searchOrders: vi.fn().mockReturnValue(of({
        content: [{ id: '1', orderName: 'ORD-001', customerName: 'Test', price: 50000 }],
        page: 0, size: 10, total: 1, totalPages: 1
      })),
      deleteOrder: vi.fn().mockReturnValue(of(void 0))
    };
    confirmServiceSpy = { confirm: vi.fn().mockResolvedValue(true) };
    paymentServiceSpy = { open: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [OrderListComponent],
      providers: [
        provideRouter([]),
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: ConfirmService, useValue: confirmServiceSpy },
        { provide: OrderPaymentService, useValue: paymentServiceSpy },
        { provide: ChangeDetectorRef, useValue: { detectChanges: vi.fn() } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    component.ngOnInit();
    expect(component.orders.length).toBe(1);
  });

  it('should reset page on search', () => {
    component.currentPage = 3;
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

  it('should delete order', async () => {
    await component.deleteOrder('1');
    expect(confirmServiceSpy.confirm).toHaveBeenCalled();
    expect(orderServiceSpy.deleteOrder).toHaveBeenCalledWith('1');
  });

  it('should pay order', async () => {
    const order = { id: '1', price: 50000 } as any;
    await component.payOrder(order);
    expect(paymentServiceSpy.open).toHaveBeenCalledWith(order);
  });

  it('should return page label', () => {
    expect(component.getPageLabel(0)).toBe('1');
    expect(component.getPageLabel('...')).toBe('...');
  });
});
