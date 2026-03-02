import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { Staff, SearchStaffRequest } from '../../models/staff.model';
import { IconComponent } from '../../../../shared/components/icon.component';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { toast } from 'ngx-sonner';
import { retry } from 'rxjs/operators';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ...SHARED_UI_IMPORTS],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {
  staffList: Staff[] = [];
  searchTerm = '';
  isLoading = false;

  currentPage = 0;
  pageSize = 10;
  pageSizeOptions = [10, 20, 50];
  totalElements = 0;
  totalPages = 0;

  displayPages: (number | '...')[] = [];

  constructor(
    private staffService: StaffService,
    private cd: ChangeDetectorRef,
    private confirmService: ConfirmService
  ) { }

  ngOnInit(): void {
    this.loadStaff();
  }

  /* ================= LOAD ================= */

  loadStaff(): void {
    this.isLoading = true;

    const request: SearchStaffRequest = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'createdAt',
      sortDir: 'desc'
    };

    if (this.searchTerm.trim()) {
      request.fullName = this.searchTerm.trim();
    }

    this.staffService.getStaffPage(request)
      .pipe(
        retry({
          count: 5,
          delay: 1000
        })
      )
      .subscribe({
        next: (response) => {
          this.staffList = response.content || [];
          this.totalElements = response.total;
          this.totalPages = response.totalPages;
          this.updateDisplayPages();
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Không thể tải danh sách nhân viên:', error);
          this.isLoading = false;

          // Mock data fallback if needed
          if (this.staffList.length === 0 && !this.searchTerm) {
            this.staffList = [
              { id: '1', fullName: 'Nguyễn Văn A (Mock)', email: 'a@example.com', phoneNumber: '0912345678', createdAt: new Date().toISOString() },
              { id: '2', fullName: 'Trần Thị B (Mock)', email: 'b@example.com', phoneNumber: '0987654321', createdAt: new Date().toISOString() }
            ];
            this.totalElements = 2;
            this.totalPages = 1;
          }
          this.updateDisplayPages();
          this.cd.detectChanges();
        }
      });
  }

  /* ================= SEARCH ================= */

  onSearch(): void {
    this.currentPage = 0; // Reset về trang đầu khi search
    this.loadStaff();
  }

  /* ================= PAGINATION ================= */

  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadStaff();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 0;
    this.loadStaff();
  }

  private updateDisplayPages(): void {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0); // Luôn hiện trang đầu

      if (this.currentPage > 2) {
        pages.push('...'); // Dấu ... nếu trang hiện tại cách trang đầu tiên > 2
      }

      const start = Math.max(1, this.currentPage - 1);
      const end = Math.min(this.totalPages - 2, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (this.currentPage < this.totalPages - 3) {
        pages.push('...'); // Dấu ... nếu trang hiện tại cách trang cuối > 2
      }

      pages.push(this.totalPages - 1); // Luôn hiện trang cuối
    }
    this.displayPages = pages;
  }

  getPageLabel(page: number | '...'): string {
    if (page === '...') {
      return '...';
    }
    return (page + 1).toString();
  }

  /* ================= DELETE ================= */

  async deleteStaff(id: string): Promise<void> {
    const confirmed = await this.confirmService.confirm(
      'Xóa nhân viên',
      'Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác.',
      'danger'
    );

    if (confirmed) {
      this.staffService.deleteStaff(id).subscribe({
        next: () => {
          toast.success('Xóa nhân viên thành công');
          this.loadStaff();
        },
        error: (error) => {
          console.error('Lỗi khi xóa nhân viên:', error);
          toast.error('Không thể xóa nhân viên. Vui lòng thử lại!');
        }
      });
    }
  }
}
