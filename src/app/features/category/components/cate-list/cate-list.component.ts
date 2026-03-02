import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { retry } from 'rxjs/operators';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';
import { CategoryService } from '../../services/cate.service';
import { Category, SearchCategoryRequest } from '../../models/cate.model';
import { IconComponent } from '../../../../shared/components/icon.component';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './cate-list.component.html',
  styleUrls: ['./cate-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];
  searchTerm = '';
  isLoading = false;

  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];
  totalPages = 0;
  totalElements = 0;

  displayPages: (number | '...')[] = [];

  constructor(
    private categoryService: CategoryService,
    private cd: ChangeDetectorRef,
    private confirmService: ConfirmService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  /* ================= LOAD ================= */

  loadCategories(): void {
    this.isLoading = true;

    const request: SearchCategoryRequest = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'createdAt',
      sortDir: 'desc',
      categoryName: this.searchTerm || undefined
    };

    this.categoryService.getCategoryPage(request)
      .pipe(retry({ count: 3, delay: 1000 }))
      .subscribe({
        next: res => {
          this.categories = res.content;
          this.totalPages = res.totalPages;
          this.totalElements = res.total;
          this.updateDisplayPages();
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          toast.error('Không thể tải danh sách danh mục');
        }
      });
  }

  /* ================= SEARCH ================= */

  onSearch(): void {
    this.currentPage = 0;
    this.loadCategories();
  }

  /* ================= PAGINATION ================= */

  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadCategories();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 0;
    this.loadCategories();
  }

  private updateDisplayPages(): void {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      if (this.currentPage > 2) {
        pages.push('...');
      }

      const start = Math.max(1, this.currentPage - 1);
      const end = Math.min(this.totalPages - 2, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (this.currentPage < this.totalPages - 3) {
        pages.push('...');
      }

      pages.push(this.totalPages - 1);
    }

    this.displayPages = pages;
  }

  getPageLabel(page: number | '...'): string {
    return page === '...' ? '...' : (page + 1).toString();
  }

  /* ================= DELETE ================= */

  async deleteCategory(id: string): Promise<void> {
    const ok = await this.confirmService.confirm(
      'Xóa danh mục',
      'Bạn có chắc chắn muốn xóa danh mục này?',
      'danger'
    );

    if (ok) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        toast.success('Xóa danh mục thành công');
        this.loadCategories();
      });
    }
  }
}
