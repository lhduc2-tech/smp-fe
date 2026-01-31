import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { retry } from 'rxjs/operators';

import { ProductService } from '../../services/product.service';
import { Product, SearchProductRequest } from '../../models/product.model';
import { IconComponent } from '../../../../shared/components/icon.component';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/components/toast/toast';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    DatePipe,
    DecimalPipe,
    IconComponent
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
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private cd: ChangeDetectorRef,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;

    const request: SearchProductRequest = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'createdAt',
      sortDir: 'desc',
      name: this.searchTerm || undefined
    };

    this.productService.getProductPage(request)
      .pipe(retry({ count: 3, delay: 1000 }))
      .subscribe({
        next: res => {
          this.products = res.content;
          this.totalPages = res.totalPages;
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.toastService.error('Không thể tải danh sách sản phẩm');
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  displayPages: (number | '...')[] = [];

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
        this.toastService.success('Xóa sản phẩm thành công');
        this.loadProducts();
      });
    }
  }
}
