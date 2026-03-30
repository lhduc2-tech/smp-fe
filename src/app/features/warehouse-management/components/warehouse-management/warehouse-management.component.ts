import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { toast } from 'ngx-sonner';

interface InventoryItem {
  productId: string;
  productCode: string;
  productName: string;
  categoryName: string;
  quantity: number;
  updatedAt: Date;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

@Component({
  selector: 'app-warehouse-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ...SHARED_UI_IMPORTS],
  templateUrl: './warehouse-management.component.html',
  styleUrls: ['./warehouse-management.component.css']
})
export class WarehouseManagementComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  // Dialog State
  isAdjustDialogOpen = false;
  selectedProduct: InventoryItem | null = null;
  adjustForm!: FormGroup;
  isAdjusting = false;

  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  
  isLoading = false;

  // Search & Filter
  searchTerm: string = '';
  statusFilter: string = 'ALL';

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  pageSizeOptions = [10, 20, 50];

  // Stats
  totalProducts = 0;
  totalQuantity = 0;
  lowStockCount = 0;
  outOfStockCount = 0;

  ngOnInit() {
    this.initAdjustForm();
    this.loadData();
  }

  initAdjustForm() {
    this.adjustForm = this.fb.group({
      newQuantity: [0, [Validators.required, Validators.min(0)]],
      reason: [''],
      note: ['']
    });
  }

  openAdjustDialog(item: InventoryItem) {
    console.log('Opening dialog for item:', item);
    this.selectedProduct = item;
    this.adjustForm.patchValue({
      newQuantity: item.quantity,
      reason: 'Kiểm kê',
      note: ''
    });
    this.isAdjustDialogOpen = true;
    this.cdr.detectChanges();
  }

  closeAdjustDialog() {
    this.isAdjustDialogOpen = false;
    this.selectedProduct = null;
    this.adjustForm.reset();
    this.cdr.detectChanges();
  }

  submitAdjustment() {
    if (this.adjustForm.invalid || !this.selectedProduct) {
      this.adjustForm.markAllAsTouched();
      return;
    }

    const { newQuantity, reason, note } = this.adjustForm.value;
    
    // Nếu số thay đổi không khác số cũ, bỏ qua
    if (newQuantity === this.selectedProduct.quantity) {
      toast.info('Số lượng tồn không có thay đổi.');
      this.closeAdjustDialog();
      return;
    }

    this.isAdjusting = true;
    this.inventoryService.adjustStock(this.selectedProduct.productId, {
      newQuantity,
      reason,
      note
    }).subscribe({
      next: () => {
        toast.success(`Đã cập nhật tồn kho cho ${this.selectedProduct?.productCode}`);
        this.isAdjusting = false;
        this.closeAdjustDialog();
        this.loadData(); // Tải lại bảng để cập nhật số liệu mới nhất
      },
      error: (err) => {
        console.error('Lỗi khi điều chỉnh tồn kho', err);
        toast.error('Có lỗi xảy ra khi cập nhật tồn kho!');
        this.isAdjusting = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadData() {
    this.isLoading = true;
    this.inventoryService.getInventoryForShop({
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'updatedAt',
      sortDir: 'desc',
      searchQuery: this.searchTerm
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        
        const content = res?.content || [];
        this.inventoryItems = content.map(dto => {
          const qty = dto.quantity ?? 0;
          return {
            productId: dto.product_id,
            productCode: dto.product_code || 'N/A',
            productName: dto.product_name || 'Không xác định',
            categoryName: dto.category_name || 'Khác',
            quantity: qty,
            updatedAt: dto.updated_at ? new Date(dto.updated_at) : new Date(),
            status: qty === 0 ? 'OUT_OF_STOCK' : (qty < 5 ? 'LOW_STOCK' : 'IN_STOCK')
          };
        });
        
        this.totalElements = res?.total || 0;
        this.totalPages = res?.totalPages || 0;
        this.totalProducts = res?.total || 0;
        
        this.applyLocalFilters();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Lỗi tải tồn kho: ', err);
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    this.totalQuantity = this.filteredItems.reduce((sum, item) => sum + item.quantity, 0);
    this.lowStockCount = this.filteredItems.filter(item => item.status === 'LOW_STOCK').length;
    this.outOfStockCount = this.filteredItems.filter(item => item.status === 'OUT_OF_STOCK').length;
  }

  onSearch() {
    this.currentPage = 0;
    this.loadData();
  }

  onStatusFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.statusFilter = value;
    this.applyLocalFilters();
  }

  applyLocalFilters() {
    let result = [...this.inventoryItems];

    // Local filtering now only for Status (Search handled by BE)
    if (this.statusFilter !== 'ALL') {
      result = result.filter(item => item.status === this.statusFilter);
    }

    this.filteredItems = result;
    this.calculateStats();
    
    // Explicit trigger to update DOM
    this.cdr.detectChanges();
  }

  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadData();
    }
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.currentPage = 0;
    this.loadData();
  }

  // Template helper
  get Math() {
    return Math;
  }
}

