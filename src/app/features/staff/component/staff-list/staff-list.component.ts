import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { Staff, SearchStaffRequest } from '../../models/staff.model';
import { IconComponent } from '../../../../shared/components/icon.component';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/components/toast/toast';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {
  staffList: Staff[] = [];
  searchTerm = '';
  isLoading = false;

  // Pagination State
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(
    private staffService: StaffService,
    private cd: ChangeDetectorRef,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.isLoading = true;

    const request: SearchStaffRequest = {
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'createdAt',
      sortDir: 'desc'
    };

    // Nếu có search term, gán vào các field search (giả định backend search OR hoặc match partial)
    if (this.searchTerm.trim()) {
      request.fullName = this.searchTerm.trim();
      // Hoặc tùy backend logic, có thể truyền vào email/phone
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
          this.isLoading = false;

          console.log('Pagination Debug:', {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            totalElements: this.totalElements,
            shouldShow: this.totalPages > 1
          });

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
          this.cd.detectChanges();
        }
      });
  }

  onSearch(): void {
    this.currentPage = 0; // Reset về trang đầu khi search
    this.loadStaff();
  }

  onPageChange(page: any): void {
    const pageNum = Number(page);
    if (!isNaN(pageNum) && pageNum >= 0 && pageNum < this.totalPages) {
      this.currentPage = pageNum;
      this.loadStaff();
    }
  }

  async deleteStaff(id: string): Promise<void> {
    const confirmed = await this.confirmService.confirm(
      'Xóa nhân viên',
      'Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể hoàn tác.',
      'danger'
    );

    if (confirmed) {
      this.staffService.deleteStaff(id).subscribe({
        next: () => {
          this.toastService.success('Xóa nhân viên thành công');
          this.loadStaff();
        },
        error: (error) => {
          console.error('Lỗi khi xóa nhân viên:', error);
          this.toastService.error('Không thể xóa nhân viên. Vui lòng thử lại!');
        }
      });
    }
  }

  get displayPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
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
    return pages;
  }

  getPageLabel(page: number | string): string {
    if (typeof page === 'number') {
      return (page + 1).toString();
    }
    return page;
  }
}
