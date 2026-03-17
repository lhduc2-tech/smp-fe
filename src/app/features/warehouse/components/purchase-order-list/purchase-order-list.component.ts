import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { retry } from 'rxjs/operators';

import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';
import { InventoryFlowService } from '../../services/inventory-flow.service';

import {
  PurchaseOrder,
  SearchPurchaseOrderRequest
} from '../../models/inventory-flow.model';

import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-purchase-order-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    DatePipe,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css']
})
export class PurchaseOrderListComponent implements OnInit {

  purchaseOrders: PurchaseOrder[] = [];

  searchTerm = '';
  statusFilter = '';

  isLoading = false;

  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];

  totalPages = 0;
  totalElements = 0;

  displayPages: (number | '...')[] = [];

  constructor(
    private service: InventoryFlowService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ================= LOAD DATA =================
  loadData(): void {
    this.isLoading = true;

    const request: SearchPurchaseOrderRequest = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'createdAt',
      sortDir: 'desc',
      status: this.statusFilter || undefined
    };

    this.service.searchPurchaseOrders(request)
      .pipe(retry({ count: 3, delay: 1000 }))
      .subscribe({
        next: res => {

          // filter FE theo note nếu có searchTerm
          this.purchaseOrders = this.searchTerm
            ? res.content.filter(po =>
                (po.note || '').toLowerCase().includes(this.searchTerm.toLowerCase())
              )
            : res.content;

          this.totalElements = res.total;
          this.totalPages = res.totalPages;

          this.updateDisplayPages();

          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          toast.error('Không thể tải danh sách phiếu nhập');
        }
      });
  }

  // ================= SEARCH =================
  onSearch(): void {
    this.currentPage = 0;
    this.loadData();
  }

  // ================= PAGINATION =================
  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadData();
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

  // ================= CONFIRM =================
  confirm(id: string): void {
    this.service.confirmPurchaseOrder(id).subscribe({
      next: () => {
        toast.success('Nhập kho thành công');
        this.loadData();
      },
      error: () => {
        toast.error('Không thể nhập kho');
      }
    });
  }
}