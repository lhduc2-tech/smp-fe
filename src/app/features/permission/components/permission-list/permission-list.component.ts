import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { retry } from 'rxjs/operators';

import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

import { PermissionService } from '../../services/permission.service';
import { Permission } from '../../models/permission.model';

import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.css']
})
export class PermissionListComponent implements OnInit {

  /* ================= DATA ================= */

  permissions: Permission[] = [];
  allPermissions: Permission[] = [];

  searchTerm = '';
  isLoading = false;

  /* ================= PAGINATION ================= */

  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];

  totalPages = 0;
  totalElements = 0;

  displayPages: (number | '...')[] = [];

  constructor(
    private permissionService: PermissionService,
    private cd: ChangeDetectorRef,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  /* ================= LOAD ================= */

  loadPermissions(): void {

    this.isLoading = true;

    this.permissionService.getAllPermissions()
      .pipe(retry({ count: 3, delay: 1000 }))
      .subscribe({

        next: res => {

          this.allPermissions = res;
          this.totalElements = res.length;

          this.applyFilterAndPaging();

          this.isLoading = false;
          this.cd.detectChanges();

        },

        error: () => {

          this.isLoading = false;
          toast.error('Không thể tải danh sách permission');

        }

      });

  }

  /* ================= SEARCH ================= */

  onSearch(): void {

    this.currentPage = 0;
    this.applyFilterAndPaging();

  }

  /* ================= FILTER + PAGING ================= */

  private applyFilterAndPaging(): void {

    let filtered = this.allPermissions;

    if (this.searchTerm) {

      const keyword = this.searchTerm.toLowerCase();

      filtered = filtered.filter(p =>
        p.code?.toLowerCase().includes(keyword)
      );

    }

    this.totalElements = filtered.length;
    this.totalPages = Math.ceil(filtered.length / this.pageSize);

    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;

    this.permissions = filtered.slice(start, end);

    this.updateDisplayPages();

  }

  /* ================= PAGINATION ================= */

  onPageChange(page: number): void {

    if (page < 0 || page >= this.totalPages) return;

    this.currentPage = page;
    this.applyFilterAndPaging();

  }

  onPageSizeChange(newSize: number): void {

    this.pageSize = newSize;
    this.currentPage = 0;

    this.applyFilterAndPaging();

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

  async deletePermission(id: string): Promise<void> {

    const ok = await this.confirmService.confirm(
      'Xóa permission',
      'Bạn có chắc chắn muốn xóa permission này?',
      'danger'
    );

    if (ok) {

      this.permissionService.deletePermission(id)
        .subscribe(() => {

          toast.success('Xóa permission thành công');

          this.loadPermissions();

        });

    }

  }

}