import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomerService } from './customer.service';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let apiServiceSpy: any;
  let authServiceSpy: any;

  beforeEach(() => {
    apiServiceSpy = { get: vi.fn(), post: vi.fn() };
    authServiceSpy = { shopId: 'shop-1', username: 'admin' };

    TestBed.configureTestingModule({
      providers: [
        CustomerService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    service = TestBed.inject(CustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get customers', () => {
    const mockRes = [
      { id: '1', full_name: 'Nguyen Van A', phone_number: '0123', email: 'a@test.com', address: 'HCM', shop_id: 'shop-1' }
    ];
    apiServiceSpy.get.mockReturnValue(of(mockRes));

    service.getCustomers().subscribe(customers => {
      expect(customers.length).toBe(1);
      expect(customers[0].name).toBe('Nguyen Van A');
      expect(customers[0].phone).toBe('0123');
    });
  });

  it('should throw error when no shopId', () => {
    authServiceSpy.shopId = null;
    expect(() => service.getCustomers()).toThrow('Shop ID not found');
  });

  it('should create customer', () => {
    const mockRes = { id: '2', full_name: 'New Customer', phone_number: '0456' };
    apiServiceSpy.post.mockReturnValue(of(mockRes));

    service.createCustomer({
      fullName: 'New Customer',
      phoneNumber: '0456',
      shopId: 'shop-1',
      createdBy: 'admin',
      updatedBy: 'admin'
    }).subscribe(customer => {
      expect(customer.id).toBe('2');
      expect(customer.name).toBe('New Customer');
    });
  });
});
