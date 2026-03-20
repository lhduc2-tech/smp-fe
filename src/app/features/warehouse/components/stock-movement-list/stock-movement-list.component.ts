import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

import { InventoryFlowService } from '../../services/inventory-flow.service';
import {
  StockMovement,
  SearchStockMovementRequest,
  PageResponse
} from '../../models/inventory-flow.model';

import { finalize } from 'rxjs';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-stock-movement-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './stock-movement-list.component.html',
  styleUrls: ['./stock-movement-list.component.css']
})
export class StockMovementListComponent implements OnInit {

  /* ================= DATA ================= */
  stockMovements: StockMovement[] = [];
  isLoading = false;

  /* ================= SEARCH ================= */
  searchTerm = '';

  /* ================= PAGINATION ================= */
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  pageSizeOptions = [5, 10, 20, 50];
  displayPages: (number | '...')[] = [];

  constructor(
    private inventoryService: InventoryFlowService,
    private cd: ChangeDetectorRef
  ) {}

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.loadStockMovements();
  }

  /* ================= LOAD ================= */
  loadStockMovements(): void {

    const request: SearchStockMovementRequest = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'createdAt',
      sortDir: 'desc',
      productId: this.searchTerm || undefined
    };

    this.isLoading = true;

    this.inventoryService.searchStockMovements(request)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cd.detectChanges(); // 👈 giống product
      }))
      .subscribe({
        next: (res: PageResponse<StockMovement>) => {

          this.stockMovements = res.content || [];
          this.totalPages = res.totalPages || 0;
          this.totalElements = res.total || 0;

          this.updateDisplayPages();
        },
        error: () => {
          toast.error('Không thể tải dữ liệu kho');
        }
      });
  }

  /* ================= SEARCH ================= */
  onSearch(): void {
    this.currentPage = 0;
    this.loadStockMovements();
  }

  /* ================= PAGINATION ================= */

  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;

    this.currentPage = page;
    this.loadStockMovements();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadStockMovements();
  }

  getPageLabel(page: number | '...'): string {
    return page === '...' ? '...' : (page + 1).toString();
  }

  /* ================= PAGINATION UI ================= */

  private updateDisplayPages(): void {

    const pages: (number | '...')[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 5) {
      for (let i = 0; i < total; i++) pages.push(i);
    } else {

      pages.push(0);

      if (current > 2) pages.push('...');

      const start = Math.max(1, current - 1);
      const end = Math.min(total - 2, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 3) pages.push('...');

      pages.push(total - 1);
    }

    this.displayPages = pages;
  }
}