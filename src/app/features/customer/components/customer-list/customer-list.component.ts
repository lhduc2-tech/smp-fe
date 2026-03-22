import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { retry } from 'rxjs/operators';

import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

import { CustomerService } from '../../services/customer.service';
import { Customer, SearchCustomerRequest } from '../../models/customer.model';

import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers: Customer[] = [];
  searchTerm = '';
  isLoading = false;

  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];
  totalPages = 0;
  totalElements = 0;

  displayPages: (number | '...')[] = [];

  constructor(
    private customerService: CustomerService,
    private cd: ChangeDetectorRef,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  /* ================= LOAD ================= */

  loadCustomers(): void {
  this.isLoading = true;

  this.customerService.getCustomersByCurrentShop()
    .pipe(retry({ count: 3, delay: 1000 }))
    .subscribe({
      next: (data: Customer[]) => {

        // 🔥 filter search ở FE (vì BE không hỗ trợ)
        let filtered = data;

        if (this.searchTerm) {
          const keyword = this.searchTerm.toLowerCase();
          filtered = data.filter(c =>
            c.fullName?.toLowerCase().includes(keyword)
          );
        }

        // 🔥 pagination thủ công
        this.totalElements = filtered.length;
        this.totalPages = Math.ceil(this.totalElements / this.pageSize);

        const start = this.currentPage * this.pageSize;
        const end = start + this.pageSize;

        this.customers = filtered.slice(start, end);

        this.updateDisplayPages();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        toast.error('Không thể tải danh sách khách hàng');
      }
    });
}
  /* ================= SEARCH ================= */

  onSearch(): void {
    this.currentPage = 0;
    this.loadCustomers();
  }

  /* ================= PAGINATION ================= */

  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadCustomers();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 0;
    this.loadCustomers();
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

  async deleteCustomer(id: string): Promise<void> {
    const ok = await this.confirmService.confirm(
      'Xóa khách hàng',
      'Bạn có chắc chắn muốn xóa khách hàng này?',
      'danger'
    );

    if (ok) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        toast.success('Xóa khách hàng thành công');
        this.loadCustomers();
      });
    }
  }
}