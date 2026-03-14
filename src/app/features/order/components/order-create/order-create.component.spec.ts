import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { OrderCreateComponent, OrderProductItem } from './order-create.component';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../../product/services/product.service';
import { CustomerService } from '../../../customer/services/customer.service';
import { AuthService } from '../../../auth/services/auth.service';

describe.skip('OrderCreateComponent', () => {
  let component: OrderCreateComponent;
  let orderServiceSpy: any;
  let productServiceSpy: any;
  let customerServiceSpy: any;
  let authServiceSpy: any;
  let router: Router;

  const mockProducts = [
    { id: 'p1', code: 'P001', name: 'Product 1', price: 50000 },
    { id: 'p2', code: 'P002', name: 'Product 2', price: 100000 }
  ];

  const mockCustomers = [
    { id: 'c1', name: 'Customer 1', phone: '0123', email: 'c1@test.com', address: 'HCM' }
  ];

  beforeEach(async () => {
    orderServiceSpy = {
      createOrder: vi.fn().mockReturnValue(of({})),
      getOrderById: vi.fn().mockReturnValue(of(null))
    };
    productServiceSpy = { getAllProductByShopId: vi.fn().mockReturnValue(of(mockProducts)) };
    customerServiceSpy = {
      getCustomers: vi.fn().mockReturnValue(of(mockCustomers)),
      createCustomer: vi.fn().mockReturnValue(of({ id: 'c2', name: 'New' }))
    };
    authServiceSpy = { shopId: 'shop-1', username: 'admin' };

    await TestBed.configureTestingModule({
      imports: [OrderCreateComponent, ReactiveFormsModule, FormsModule],
      providers: [
        provideRouter([]),
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CustomerService, useValue: customerServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { paramMap: { get: () => null } },
            params: of({}), paramMap: of({ get: () => null }), queryParamMap: of({ get: () => null })
          } 
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(OrderCreateComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(async () => true);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode', () => {
    expect(component.isViewMode).toBe(false);
  });

  it('should have form initialized', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('customerName')).toBeTruthy();
  });

  it('should add product to order items', () => {
    component.products = mockProducts as any;
    component.onProductSelected({ value: 'p1', label: 'Product 1' });
    expect(component.orderItems.length).toBe(1);
    expect(component.orderItems[0].quantity).toBe(1);
    expect(component.orderItems[0].unitPrice).toBe(50000);
  });

  it('should increase quantity of existing product', () => {
    component.products = mockProducts as any;
    component.onProductSelected({ value: 'p1', label: 'Product 1' });
    component.onProductSelected({ value: 'p1', label: 'Product 1' });
    expect(component.orderItems.length).toBe(1);
    expect(component.orderItems[0].quantity).toBe(2);
    expect(component.orderItems[0].totalPrice).toBe(100000);
  });

  it('should increase qty', () => {
    const item: OrderProductItem = { product: mockProducts[0] as any, quantity: 1, unitPrice: 50000, totalPrice: 50000 };
    component.increaseQty(item);
    expect(item.quantity).toBe(2);
    expect(item.totalPrice).toBe(100000);
  });

  it('should decrease qty but not below 1', () => {
    const item: OrderProductItem = { product: mockProducts[0] as any, quantity: 2, unitPrice: 50000, totalPrice: 100000 };
    component.decreaseQty(item);
    expect(item.quantity).toBe(1);
    component.decreaseQty(item);
    expect(item.quantity).toBe(1);
  });

  it('should remove item', () => {
    component.orderItems = [
      { product: mockProducts[0] as any, quantity: 1, unitPrice: 50000, totalPrice: 50000 }
    ];
    component.removeItem(0);
    expect(component.orderItems.length).toBe(0);
  });

  it('should calculate subtotal', () => {
    component.orderItems = [
      { product: mockProducts[0] as any, quantity: 2, unitPrice: 50000, totalPrice: 100000 },
      { product: mockProducts[1] as any, quantity: 1, unitPrice: 100000, totalPrice: 100000 }
    ];
    expect(component.subtotal).toBe(200000);
  });

  it('should calculate shipping fee', () => {
    expect(component.shippingFee).toBe(0);
    component.orderItems = [{ product: mockProducts[0] as any, quantity: 1, unitPrice: 50000, totalPrice: 50000 }];
    expect(component.shippingFee).toBe(30000);
  });

  it('should calculate discount with voucher', () => {
    component.appliedVoucher = 'SALE_ADMIN_2024';
    component.selectedPaymentMethod = 'BANK_TRANSFER';
    component.orderItems = [{ product: mockProducts[0] as any, quantity: 1, unitPrice: 50000, totalPrice: 50000 }];
    expect(component.discount).toBe(50000 * 0.05);
  });

  it('should not apply discount without bank transfer', () => {
    component.appliedVoucher = 'SALE_ADMIN_2024';
    component.selectedPaymentMethod = 'CASH';
    component.orderItems = [{ product: mockProducts[0] as any, quantity: 1, unitPrice: 50000, totalPrice: 50000 }];
    expect(component.discount).toBe(0);
  });

  it('should calculate grand total', () => {
    component.orderItems = [{ product: mockProducts[0] as any, quantity: 1, unitPrice: 50000, totalPrice: 50000 }];
    expect(component.grandTotal).toBe(50000 + 30000);
  });

  it('should toggle customer mode', () => {
    expect(component.isNewCustomer).toBe(false);
    component.toggleCustomerMode();
    expect(component.isNewCustomer).toBe(true);
  });

  it('should remove voucher', () => {
    component.appliedVoucher = 'SALE_ADMIN_2024';
    component.removeVoucher();
    expect(component.appliedVoucher).toBeNull();
  });

  it('should cancel and navigate', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/orders']);
  });
});
