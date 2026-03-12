import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { retry } from 'rxjs/operators';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';
import { OrderService } from '../../services/order.service';
import { Order, SearchOrderRequest } from '../../models/order.model';
import { IconComponent } from '../../../../shared/components/icon.component';
import { ConfirmService } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { OrderPaymentService } from '../order-payment/order-payment-dialog.component';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        ...SHARED_UI_IMPORTS
    ],
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

    orders: Order[] = [];
    searchTerm = '';
    isLoading = false;

    currentPage = 0;
    pageSize = 10;
    pageSizeOptions = [10, 20, 50];
    totalPages = 0;
    totalElements = 0;

    displayPages: (number | '...')[] = [];

    constructor(
        private orderService: OrderService,
        private cd: ChangeDetectorRef,
        private confirmService: ConfirmService,
        private paymentService: OrderPaymentService
    ) { }

    ngOnInit(): void {
        this.loadOrders();
    }

    /* ================= LOAD ================= */

    loadOrders(): void {
        this.isLoading = true;

        const request: SearchOrderRequest = {
            page: this.currentPage,
            size: this.pageSize,
            sortBy: 'createdAt',
            sortDir: 'desc',
            customerName: this.searchTerm || undefined
        };

        this.orderService.searchOrders(request)
            .pipe(retry({ count: 3, delay: 1000 }))
            .subscribe({
                next: res => {
                    this.orders = res.content;
                    this.totalPages = res.totalPages;
                    this.totalElements = res.total;
                    this.updateDisplayPages();
                    this.isLoading = false;
                    this.cd.detectChanges();
                },
                error: () => {
                    this.isLoading = false;
                    toast.error('Không thể tải danh sách đơn hàng');
                }
            });
    }

    /* ================= SEARCH ================= */

    onSearch(): void {
        this.currentPage = 0;
        this.loadOrders();
    }

    /* ================= PAGINATION ================= */

    onPageChange(page: number): void {
        if (page < 0 || page >= this.totalPages) return;
        this.currentPage = page;
        this.loadOrders();
    }

    onPageSizeChange(newSize: number): void {
        this.pageSize = newSize;
        this.currentPage = 0;
        this.loadOrders();
    }

    /* ================= DELETE ================= */

    async deleteOrder(id: string): Promise<void> {

    const ok = await this.confirmService.confirm(
        'Xóa đơn hàng',
        'Bạn có chắc chắn muốn xóa đơn hàng này?',
        'danger'
    );

    if (ok) {
        this.orderService.deleteOrder(id).subscribe({
        next: () => {
            toast.success('Xóa đơn hàng thành công');
            this.loadOrders();
        },
        error: () => {
            toast.error('Xóa đơn hàng thất bại');
        }
        });
    }

    }

    /* ================= PAY ORDER ================= */

    async payOrder(order: Order): Promise<void> {
        const success = await this.paymentService.open(order);
        if (success) {
            this.loadOrders();
        }
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
