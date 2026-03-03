import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { retry } from 'rxjs/operators';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';
import { SupplierService } from '../../services/supplier.service';
import { Supplier, SearchSupplierRequest } from '../../models/supplier.model';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {

  suppliers: Supplier[] = [];
  searchTerm = '';
  isLoading = false;

  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];
  totalPages = 0;
  totalElements = 0;

  displayPages: (number | '...')[] = [];

  constructor(
    private supplierService: SupplierService,
    private cd: ChangeDetectorRef,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  /* ================= LOAD ================= */

  loadSuppliers(): void {
    this.isLoading = true;

    const request: SearchSupplierRequest = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'createdAt',
      sortDir: 'desc',
      supplierName: this.searchTerm || undefined
    };

    this.supplierService.getSupplierPage(request)
      .pipe(retry({ count: 3, delay: 1000 }))
      .subscribe({
        next: res => {
          this.suppliers = res.content;
          this.totalPages = res.totalPages;
          this.totalElements = res.total;
          this.updateDisplayPages();
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          toast.error('Không thể tải danh sách nhà cung cấp');
        }
      });
  }

  /* ================= SEARCH ================= */

  onSearch(): void {
    this.currentPage = 0;
    this.loadSuppliers();
  }

  /* ================= PAGINATION ================= */

  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadSuppliers();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 0;
    this.loadSuppliers();
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

  async deleteSupplier(id: string): Promise<void> {
    const ok = await this.confirmService.confirm(
      'Xóa nhà cung cấp',
      'Bạn có chắc chắn muốn xóa nhà cung cấp này?',
      'danger'
    );

    if (ok) {
      this.supplierService.deleteSupplier(id).subscribe(() => {
        toast.success('Xóa nhà cung cấp thành công');
        this.loadSuppliers();
      });
    }
  }
}