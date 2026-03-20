import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { retry } from 'rxjs/operators';

import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    DatePipe,
    DecimalPipe,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  searchTerm = '';
  isLoading = false;

  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];
  totalPages = 0;
  totalElements = 0;

  displayPages: (number | '...')[] = [];

  constructor(
    private productService: ProductService,
    private cd: ChangeDetectorRef,
    private confirmService: ConfirmService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;

    this.productService.getProductPage({
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'createdAt',
      sortDir: 'desc',
      searchQuery: this.searchTerm || undefined
    })
      .pipe(retry({ count: 3, delay: 1000 }))
      .subscribe({
        next: res => {
          this.products = res.content;
          this.totalElements = res.total;
          this.totalPages = res.totalPages;
          this.updateDisplayPages();
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          toast.error('Không thể tải danh sách sản phẩm');
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 0;
    this.loadProducts();
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

  async deleteProduct(id: string): Promise<void> {
    const ok = await this.confirmService.confirm(
      'Xóa sản phẩm',
      'Bạn có chắc chắn muốn xóa sản phẩm này?',
      'danger'
    );

    if (ok) {
      this.productService.deleteProduct(id).subscribe(() => {
        toast.success('Xóa sản phẩm thành công');
        this.loadProducts();
      });
    }
  }
}
