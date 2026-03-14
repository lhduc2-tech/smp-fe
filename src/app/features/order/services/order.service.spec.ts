import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OrderService } from './order.service';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

describe('OrderService', () => {
  let service: OrderService;
  let apiServiceSpy: any;

  beforeEach(() => {
    apiServiceSpy = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
    const authSpy = { shopId: 'shop-1', username: 'admin' };

    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    });
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search orders', () => {
    const mockRes = {
      content: [{
        id: '1', price: 50000, order_items: [],
        order_date: '2024-01-01', customer_name: 'Test',
        order_origin: 'ONLINE', payment_state: 'PENDING',
        process_state: 'NEW', delivery_service: 'GHN',
        shop_id: 'shop-1', order_name: 'ORD-001'
      }],
      page_number: 0, page_size: 10, total_elements: 1, total_pages: 1
    };
    apiServiceSpy.post.mockReturnValue(of(mockRes));

    service.searchOrders({ page: 0, size: 10 }).subscribe(page => {
      expect(page.content.length).toBe(1);
      expect(page.content[0].orderName).toBe('ORD-001');
      expect(page.content[0].customerName).toBe('Test');
    });
  });

  it('should create order', () => {
    const mockRes = {
      id: '1', price: 50000, order_items: [],
      order_date: '2024-01-01', customer_name: 'Test',
      order_origin: 'ONLINE', payment_state: 'PENDING',
      process_state: 'NEW', delivery_service: 'GHN',
      shop_id: 'shop-1', order_name: 'ORD-001'
    };
    apiServiceSpy.post.mockReturnValue(of(mockRes));

    service.createOrder({
      orderDate: '2024-01-01', orderOrigin: 'ONLINE', price: 50000,
      paymentState: 'PENDING', processState: 'NEW', deliveryService: 'GHN',
      shopId: 'shop-1', createdBy: 'admin', updatedBy: 'admin'
    }).subscribe(order => {
      expect(order.id).toBe('1');
    });
  });

  it('should delete order', () => {
    apiServiceSpy.delete.mockReturnValue(of(void 0));
    service.deleteOrder('1').subscribe();
    expect(apiServiceSpy.delete).toHaveBeenCalledWith('/private/api/v1/order/1');
  });

  it('should get order by id', () => {
    const mockRes = {
      id: '1', price: 50000, order_items: [],
      order_date: '2024-01-01', customer_name: 'Test',
      order_origin: 'ONLINE', payment_state: 'PAID',
      process_state: 'NEW', delivery_service: 'GHN',
      shop_id: 'shop-1', order_name: 'ORD-001'
    };
    apiServiceSpy.get.mockReturnValue(of(mockRes));

    service.getOrderById('1').subscribe(order => {
      expect(order.paymentState).toBe('PAID');
    });
  });

  it('should update order', () => {
    const mockRes = {
      id: '1', price: 60000, order_items: [],
      order_date: '2024-01-01', customer_name: 'Test',
      order_origin: 'ONLINE', payment_state: 'PAID',
      process_state: 'NEW', delivery_service: 'GHN',
      shop_id: 'shop-1', order_name: 'ORD-001'
    };
    apiServiceSpy.put.mockReturnValue(of(mockRes));

    service.updateOrder('1', {
      orderDate: '2024-01-01', orderOrigin: 'ONLINE', price: 60000,
      paymentState: 'PAID', processState: 'NEW', deliveryService: 'GHN'
    }).subscribe(order => {
      expect(order.price).toBe(60000);
    });
  });
});
