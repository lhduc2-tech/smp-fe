import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { retry } from 'rxjs/operators';

import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';

import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ...SHARED_UI_IMPORTS
  ],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {

  roles: Role[] = [];
  allRoles: Role[] = [];

  searchTerm = '';
  isLoading = false;

  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];

  totalPages = 0;
  totalElements = 0;

  displayPages: (number | '...')[] = [];

  constructor(
    private roleService: RoleService,
    private cd: ChangeDetectorRef,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  /* ================= LOAD ================= */

  loadRoles(): void {

    this.isLoading = true;

    this.roleService.searchRoles({
      page: 0,
      size: 1000,
      sortBy: 'createdAt',
      sortDir: 'desc'
    })
    .pipe(retry({ count: 3, delay: 1000 }))
    .subscribe({

      next: res => {

        this.allRoles = res.content;
        this.totalElements = res.content.length;

        this.applyFilterAndPaging();

        this.isLoading = false;
        this.cd.detectChanges();

      },

      error: () => {

        this.isLoading = false;
        toast.error('Không thể tải danh sách role');

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

    let filtered = this.allRoles;

    if (this.searchTerm) {

      const keyword = this.searchTerm.toLowerCase();

      filtered = filtered.filter(r =>
        r.code?.toLowerCase().includes(keyword) ||
        r.name?.toLowerCase().includes(keyword)
      );

    }

    this.totalElements = filtered.length;
    this.totalPages = Math.ceil(filtered.length / this.pageSize);

    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;

    this.roles = filtered.slice(start, end);

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

  async deleteRole(id: string): Promise<void> {

    const ok = await this.confirmService.confirm(
      'Xóa role',
      'Bạn có chắc chắn muốn xóa role này?',
      'danger'
    );

    if (ok) {

      this.roleService.deleteRole(id)
        .subscribe(() => {

          toast.success('Xóa role thành công');

          this.loadRoles();

        });

    }

  }

}