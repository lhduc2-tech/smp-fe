import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CategoryService } from './cate.service';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let apiServiceSpy: any;

  beforeEach(() => {
    apiServiceSpy = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
    const authSpy = { shopId: 'shop-1', username: 'admin' };

    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    });
    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get category page', () => {
    const mockRes = {
      content: [{ id: '1', category_name: 'Cat1', category_description: 'Desc' }],
      page_number: 0, page_size: 10, total_elements: 1, total_pages: 1
    };
    apiServiceSpy.post.mockReturnValue(of(mockRes));

    service.getCategoryPage({ page: 0, size: 10 }).subscribe(page => {
      expect(page.content.length).toBe(1);
      expect(page.content[0].categoryName).toBe('Cat1');
    });
  });

  it('should get all categories', () => {
    apiServiceSpy.get.mockReturnValue(of([{ id: '1', category_name: 'Cat1' }]));

    service.getAllCategories().subscribe(cats => {
      expect(cats.length).toBe(1);
      expect(cats[0].categoryName).toBe('Cat1');
    });
  });

  it('should add category', () => {
    apiServiceSpy.post.mockReturnValue(of({ id: '1', category_name: 'New' }));

    service.addCategory({ categoryName: 'New' }).subscribe(cat => {
      expect(cat.categoryName).toBe('New');
    });
  });

  it('should update category', () => {
    apiServiceSpy.put.mockReturnValue(of({ id: '1', category_name: 'Updated' }));

    service.updateCategory('1', { categoryName: 'Updated' }).subscribe(cat => {
      expect(cat.categoryName).toBe('Updated');
    });
  });

  it('should get category by id', () => {
    apiServiceSpy.get.mockReturnValue(of({ id: '1', category_name: 'Cat1' }));

    service.getCategoryById('1').subscribe(cat => {
      expect(cat.id).toBe('1');
    });
  });

  it('should delete category', () => {
    apiServiceSpy.delete.mockReturnValue(of(void 0));
    service.deleteCategory('1').subscribe();
    expect(apiServiceSpy.delete).toHaveBeenCalledWith('/private/api/v1/category/1');
  });
});
