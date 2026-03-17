import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { retry } from 'rxjs/operators';

import { SHARED_UI_IMPORTS } from '../../../shared/components/ui';
import { InventoryService } from '../services/inventory.service';
import { Inventory } from '../models/inventory.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {

  inventories: Inventory[] = [];
  searchTerm = '';
  isLoading = false;

  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];
  totalPages = 0;
  totalElements = 0;

  displayPages: (number | '...')[] = [];

  constructor(
    private inventoryService: InventoryService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInventories();
  }

  // ================= LOAD DATA =================
  loadInventories(): void {
    this.isLoading = true;

    this.inventoryService.getInventoryPage({
      page: this.currentPage,
      size: this.pageSize
    })
    .pipe(retry({ count: 3, delay: 1000 }))
    .subscribe({
      next: res => {

        // nếu có search FE (optional)
        this.inventories = this.searchTerm
          ? res.content.filter(i =>
              i.product_name?.toLowerCase().includes(this.searchTerm.toLowerCase())
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
        toast.error('Không thể tải dữ liệu tồn kho');
      }
    });
  }

  // ================= SEARCH =================
  onSearch(): void {
    this.currentPage = 0;
    this.loadInventories();
  }

  // ================= PAGINATION =================
  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadInventories();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 0;
    this.loadInventories();
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
}