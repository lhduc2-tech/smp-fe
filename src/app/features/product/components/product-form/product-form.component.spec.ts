import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../category/services/cate.service';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let productServiceSpy: any;
  let categoryServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    productServiceSpy = {
      addProduct: vi.fn().mockReturnValue(of({})),
      updateProduct: vi.fn().mockReturnValue(of({})),
      getProductById: vi.fn().mockReturnValue(of({ code: 'P001', name: 'Test', price: 5000, categoryId: '1' }))
    };
    categoryServiceSpy = {
      getAllCategories: vi.fn().mockReturnValue(of([{ id: '1', categoryName: 'Cat1' }]))
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
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

    const fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(async () => true);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.get('code')?.value).toBe('');
    expect(component.form.get('price')?.value).toBe(0);
  });

  it('should be in create mode when no id in route', () => {
    expect(component.isEdit).toBe(false);
  });

  it('should require code field', () => {
    component.form.patchValue({ code: '' });
    expect(component.form.get('code')?.hasError('required')).toBe(true);
  });

  it('should require name field', () => {
    component.form.patchValue({ name: '' });
    expect(component.form.get('name')?.hasError('required')).toBe(true);
  });

  it('should validate price min 1000', () => {
    component.form.patchValue({ price: 500 });
    expect(component.form.get('price')?.hasError('min')).toBe(true);
  });

  it('should validate price max 999999999', () => {
    component.form.patchValue({ price: 1000000000 });
    expect(component.form.get('price')?.hasError('max')).toBe(true);
  });

  it('should accept valid price', () => {
    component.form.patchValue({ price: 5000 });
    expect(component.form.get('price')?.valid).toBe(true);
  });

  it('should load categories on init', () => {
    expect(categoryServiceSpy.getAllCategories).toHaveBeenCalled();
    expect(component.categories.length).toBe(1);
  });

  it('should not submit when form is invalid', () => {
    component.submit();
    expect(productServiceSpy.addProduct).not.toHaveBeenCalled();
  });

  it('should call addProduct on valid submit in create mode', () => {
    component.form.patchValue({ code: 'P001', name: 'Test', price: 5000, categoryId: '1' });
    component.submit();
    expect(productServiceSpy.addProduct).toHaveBeenCalled();
  });
});
