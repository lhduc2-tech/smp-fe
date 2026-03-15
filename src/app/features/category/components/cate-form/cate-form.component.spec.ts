import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CategoryFormComponent } from './cate-form.component';
import { CategoryService } from '../../services/cate.service';
import { AuthService } from '../../../auth/services/auth.service';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let categoryServiceSpy: any;
  let authServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    categoryServiceSpy = {
      addCategory: vi.fn().mockReturnValue(of({})),
      updateCategory: vi.fn().mockReturnValue(of({})),
      getCategoryById: vi.fn().mockReturnValue(of({ categoryName: 'Cat1', categoryDescription: 'Desc' }))
    };
    authServiceSpy = { shopId: 'shop-1' };

    await TestBed.configureTestingModule({
      imports: [CategoryFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: CategoryService, useValue: categoryServiceSpy },
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

    const fixture = TestBed.createComponent(CategoryFormComponent);
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

  it('should require categoryName', () => {
    expect(component.form.get('categoryName')?.hasError('required')).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component.submit();
    expect(categoryServiceSpy.addCategory).not.toHaveBeenCalled();
  });

  it('should call addCategory on valid submit', () => {
    component.form.patchValue({ categoryName: 'New Category' });
    component.submit();
    expect(categoryServiceSpy.addCategory).toHaveBeenCalled();
  });

  it('should not submit when shopId is missing', () => {
    authServiceSpy.shopId = null;
    component.form.patchValue({ categoryName: 'New Category' });
    component.submit();
    expect(categoryServiceSpy.addCategory).not.toHaveBeenCalled();
  });
});
