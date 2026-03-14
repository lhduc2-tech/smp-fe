import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductService } from './product.service';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

describe('ProductService', () => {
  let service: ProductService;
  let apiServiceSpy: any;
  let authServiceSpy: any;

  beforeEach(() => {
    apiServiceSpy = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };
    authServiceSpy = {
      shopId: 'shop-1',
      username: 'admin'
    };

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products by shop id', () => {
    const mockResponse = [
      { id: '1', code: 'P001', name: 'Product 1', price: 10000, shop_id: 'shop-1' }
    ];
    apiServiceSpy.get.mockReturnValue(of(mockResponse));

    service.getAllProductByShopId().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Product 1');
      expect(products[0].shopId).toBe('shop-1');
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/private/api/v1/products/by-shop/shop-1');
  });

  it('should throw error when no shopId', () => {
    authServiceSpy.shopId = null;
    expect(() => service.getAllProductByShopId()).toThrow('Shop ID not found');
  });

  it('should add a product', () => {
    const mockResponse = { id: '1', code: 'P001', name: 'New', price: 5000 };
    apiServiceSpy.post.mockReturnValue(of(mockResponse));

    service.addProduct({ code: 'P001', name: 'New', price: 5000 }).subscribe(product => {
      expect(product.id).toBe('1');
    });

    expect(apiServiceSpy.post).toHaveBeenCalled();
  });

  it('should update a product', () => {
    const mockResponse = { id: '1', code: 'P001', name: 'Updated', price: 6000 };
    apiServiceSpy.put.mockReturnValue(of(mockResponse));

    service.updateProduct({ id: '1', code: 'P001', name: 'Updated', price: 6000 }).subscribe(product => {
      expect(product.name).toBe('Updated');
    });

    expect(apiServiceSpy.put).toHaveBeenCalledWith('/private/api/v1/products/1', expect.any(Object));
  });

  it('should delete a product', () => {
    apiServiceSpy.delete.mockReturnValue(of(void 0));

    service.deleteProduct('1').subscribe();

    expect(apiServiceSpy.delete).toHaveBeenCalledWith('/private/api/v1/products/1');
  });

  it('should get product by id', () => {
    const mockResponse = { id: '1', code: 'P001', name: 'Test', price: 1000 };
    apiServiceSpy.get.mockReturnValue(of(mockResponse));

    service.getProductById('1').subscribe(product => {
      expect(product.id).toBe('1');
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/private/api/v1/products/1');
  });

  it('should search products with pagination', () => {
    const mockResponse = {
      content: [{ id: '1', code: 'P001', name: 'Test', price: 1000 }],
      page_number: 0,
      page_size: 10,
      total_elements: 1,
      total_pages: 1
    };
    apiServiceSpy.post.mockReturnValue(of(mockResponse));

    service.getProductPage({ page: 0, size: 10 }).subscribe(page => {
      expect(page.content.length).toBe(1);
      expect(page.total).toBe(1);
    });
  });
});
