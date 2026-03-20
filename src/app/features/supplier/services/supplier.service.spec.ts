import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SupplierService } from './supplier.service';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

describe('SupplierService', () => {
  let service: SupplierService;
  let apiServiceSpy: any;

  beforeEach(() => {
    apiServiceSpy = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
    const authSpy = { shopId: 'shop-1', username: 'admin' };

    TestBed.configureTestingModule({
      providers: [
        SupplierService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    });
    service = TestBed.inject(SupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search suppliers', () => {
    const mockRes = {
      content: [{ id: '1', supplier_name: 'Sup1', code: 'S001', phone_number: '0123' }],
      page_number: 0, page_size: 10, total_elements: 1, total_pages: 1
    };
    apiServiceSpy.post.mockReturnValue(of(mockRes));

    service.getSupplierPage({ page: 0, size: 10 }).subscribe(page => {
      expect(page.content.length).toBe(1);
      expect(page.content[0].supplierName).toBe('Sup1');
    });
  });

  it('should add supplier', () => {
    apiServiceSpy.post.mockReturnValue(of({ id: '1', supplier_name: 'New', code: 'S002', phone_number: '0456' }));

    service.addSupplier({ supplierName: 'New', code: 'S002', phoneNumber: '0456' }).subscribe(sup => {
      expect(sup.supplierName).toBe('New');
      expect(apiServiceSpy.post).toHaveBeenCalledWith(
        '/private/api/v1/suppliers',
        expect.objectContaining({ shopId: 'shop-1' })
      );
    });
  });

  it('should update supplier', () => {
    apiServiceSpy.put.mockReturnValue(of({ id: '1', supplier_name: 'Updated', code: 'S001', phone_number: '0123' }));

    service.updateSupplier('1', { supplierName: 'Updated', code: 'S001', phoneNumber: '0123' }).subscribe(sup => {
      expect(sup.supplierName).toBe('Updated');
      expect(apiServiceSpy.put).toHaveBeenCalledWith(
        '/private/api/v1/suppliers/1',
        expect.objectContaining({ shopId: 'shop-1' })
      );
    });
  });

  it('should get supplier by id', () => {
    apiServiceSpy.get.mockReturnValue(of({ id: '1', supplier_name: 'Sup1', code: 'S001' }));

    service.getSupplierById('1').subscribe(sup => {
      expect(sup.id).toBe('1');
    });
  });

  it('should delete supplier', () => {
    apiServiceSpy.delete.mockReturnValue(of(void 0));
    service.deleteSupplier('1').subscribe();
    expect(apiServiceSpy.delete).toHaveBeenCalledWith('/private/api/v1/suppliers/1');
  });
});
