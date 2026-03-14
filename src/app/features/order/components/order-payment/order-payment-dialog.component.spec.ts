import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { OrderPaymentService, OrderPaymentDialogComponent } from './order-payment-dialog.component';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

describe.skip('OrderPaymentService', () => {
  let service: OrderPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog', () => {
    const order = { id: '1', price: 50000 } as Order;
    service.open(order);
    expect(service.dialogState().isOpen).toBe(true);
    expect(service.dialogState().order).toBe(order);
  });

  it('should close dialog with result', async () => {
    const order = { id: '1', price: 50000 } as Order;
    const promise = service.open(order);
    service.close(true);
    const result = await promise;
    expect(result).toBe(true);
    expect(service.dialogState().isOpen).toBe(false);
  });
});

describe.skip('OrderPaymentDialogComponent', () => {
  let component: OrderPaymentDialogComponent;
  let paymentService: OrderPaymentService;
  let orderServiceSpy: any;

  const mockOrder: Order = {
    id: '1', price: 100000, orderItems: [],
    orderDate: '2024-01-01', customerName: 'Test',
    orderOrigin: 'ONLINE', paymentState: 'PENDING',
    processState: 'NEW', deliveryService: 'GHN',
    shopId: 'shop-1', orderName: 'ORD-001'
  };

  beforeEach(async () => {
    orderServiceSpy = { updateOrder: vi.fn().mockReturnValue(of({})) };

    await TestBed.configureTestingModule({
      imports: [OrderPaymentDialogComponent],
      providers: [
        OrderPaymentService,
        { provide: OrderService, useValue: orderServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(OrderPaymentDialogComponent);
    component = fixture.componentInstance;
    paymentService = TestBed.inject(OrderPaymentService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return payment state label for PENDING', () => {
    paymentService.open(mockOrder);
    expect(component.paymentStateLabel).toBe('Chờ thanh toán');
  });

  it('should return payment state label for PAID', () => {
    paymentService.open({ ...mockOrder, paymentState: 'PAID' });
    expect(component.paymentStateLabel).toBe('Đã thanh toán');
  });

  it('should return payment state label for FAILED', () => {
    paymentService.open({ ...mockOrder, paymentState: 'FAILED' });
    expect(component.paymentStateLabel).toBe('Thất bại');
  });

  it('should calculate change amount', () => {
    paymentService.open(mockOrder);
    component.cashReceived = 150000;
    expect(component.changeAmount).toBe(50000);
  });

  it('should not allow confirm for CASH when insufficient', () => {
    paymentService.open(mockOrder);
    component.selectedMethod = 'CASH';
    component.cashReceived = 5000;
    expect(component.canConfirm).toBe(false);
  });

  it('should allow confirm for CASH when sufficient', () => {
    paymentService.open(mockOrder);
    component.selectedMethod = 'CASH';
    component.cashReceived = 100000;
    expect(component.canConfirm).toBe(true);
  });

  it('should allow confirm for BANK_TRANSFER', () => {
    paymentService.open(mockOrder);
    component.selectedMethod = 'BANK_TRANSFER';
    expect(component.canConfirm).toBe(true);
  });

  it('should select payment method', () => {
    component.selectMethod('CARD');
    expect(component.selectedMethod).toBe('CARD');
    expect(component.cashReceived).toBe(0);
  });

  it('should set cash amount', () => {
    component.setCashAmount(200000);
    expect(component.cashReceived).toBe(200000);
    expect(component.selectedQuickAmount).toBe(200000);
  });

  it('should set cash exact', () => {
    paymentService.open(mockOrder);
    component.setCashExact();
    expect(component.cashReceived).toBe(100000);
    expect(component.selectedQuickAmount).toBe('exact');
  });

  it('should reset quick amount on cash change', () => {
    component.selectedQuickAmount = 50000;
    component.onCashChange();
    expect(component.selectedQuickAmount).toBeNull();
  });

  it('should confirm payment', () => {
    paymentService.open(mockOrder);
    component.selectedMethod = 'BANK_TRANSFER';

    component.confirmPayment();

    expect(orderServiceSpy.updateOrder).toHaveBeenCalledWith('1', expect.objectContaining({
      paymentState: 'PAID',
      paymentMethod: 'BANK_TRANSFER'
    }));
  });

  it('should cancel and close dialog', () => {
    paymentService.open(mockOrder);
    const closeSpy = vi.spyOn(paymentService, 'close');
    component.cancel();
    expect(closeSpy).toHaveBeenCalledWith(false);
  });
});
