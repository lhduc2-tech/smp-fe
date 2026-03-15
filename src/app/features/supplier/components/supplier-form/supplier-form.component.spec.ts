import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { SupplierFormComponent } from './supplier-form.component';
import { SupplierService } from '../../services/supplier.service';

describe('SupplierFormComponent', () => {
  let component: SupplierFormComponent;
  let supplierServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    supplierServiceSpy = {
      addSupplier: vi.fn().mockReturnValue(of({})),
      updateSupplier: vi.fn().mockReturnValue(of({})),
      getSupplierById: vi.fn().mockReturnValue(of({ supplierName: 'Sup1', code: 'S001', phoneNumber: '0123' }))
    };

    await TestBed.configureTestingModule({
      imports: [SupplierFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: SupplierService, useValue: supplierServiceSpy },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { paramMap: { get: () => null } },
            params: of({}),
            paramMap: of({ get: () => null }),
            queryParamMap: of({ get: () => null })
          } 
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(SupplierFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(async () => true);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be in create mode', () => {
    expect(component.isEdit).toBe(false);
  });

  it('should require supplierName', () => {
    expect(component.form.get('supplierName')?.hasError('required')).toBe(true);
  });

  it('should require code', () => {
    expect(component.form.get('code')?.hasError('required')).toBe(true);
  });

  it('should not submit when invalid', () => {
    component.submit();
    expect(supplierServiceSpy.addSupplier).not.toHaveBeenCalled();
  });

  it('should call addSupplier on valid submit', () => {
    component.form.patchValue({ supplierName: 'Test', code: 'S001', phoneNumber: '0123' });
    component.submit();
    expect(supplierServiceSpy.addSupplier).toHaveBeenCalled();
  });
});
