import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

import { InventoryFlowService } from '../../services/inventory-flow.service';
import { PurchaseOrder,PurchaseOrderItem } from '../../models/inventory-flow.model';

import { ProductService } from '../../../product/services/product.service';
import { Product } from '../../../product/models/product.model';

import { LucideAngularModule, Package, CheckCircle, ArrowLeft } from 'lucide-angular';

import { toast } from 'ngx-sonner';
import { finalize } from 'rxjs';

import { ZardComboboxOption } from '../../../../shared/components/combobox/combobox.component';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ...SHARED_UI_IMPORTS,
    LucideAngularModule
  ],
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.css']
})
export class PurchaseOrderDetailComponent implements OnInit {

  /* ================= ICON ================= */
  readonly iconPackage = Package;
  readonly iconCheck = CheckCircle;
  readonly iconBack = ArrowLeft;

  /* ================= DATA ================= */
  orderId!: string;
  purchaseOrder?: PurchaseOrder;

  isLoading = false;

  /* ================= PRODUCT ================= */
  products: Product[] = [];
  productOptions: ZardComboboxOption[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryFlowService,
    private productService: ProductService
  ) {}

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
  }

  /* ================= LOAD ================= */
  loadData(): void {

    this.isLoading = true;

    this.productService.getAllProductByShopId().subscribe({
      next: (products) => {

        this.products = products;

        this.productOptions = products.map(p => ({
          value: p.id,
          label: `${p.name} — ${p.code}`
        }));

        this.loadDetail();
      }
    });

  }

  loadDetail(): void {

    this.inventoryService.getPurchaseOrderById(this.orderId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({

        next: (res) => {
          this.purchaseOrder = res;
        },

        error: () => {
          toast.error('Không thể tải chi tiết đơn nhập');
        }

      });

  }

  /* ================= ITEMS ================= */
    get items(): PurchaseOrderItem[] {
    return this.purchaseOrder?.purchaseOrderItems || [];
    }

  /* ================= PRODUCT SELECT ================= */
  onProductSelected(option: ZardComboboxOption): void {

    if (this.purchaseOrder?.status !== 'DRAFT') return;

    const product = this.products.find(p => p.id === option.value);
    if (!product) return;

    const existing = this.items.find(i => i.product_id === product.id);

    if (existing) {

      existing.quantity += 1;

    } else {

      this.items.push({
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        import_price: product.price || 0
      });

    }

  }
onNoteChange(value: string): void {
  if (!this.purchaseOrder) return;
  this.purchaseOrder.note = value;
}
  /* ================= UPDATE ITEM ================= */

  increaseQty(item: any): void {
    if (this.purchaseOrder?.status !== 'DRAFT') return;
    item.quantity++;
  }

  decreaseQty(item: any): void {
    if (this.purchaseOrder?.status !== 'DRAFT') return;
    if (item.quantity > 1) item.quantity--;
  }

  updateQty(item: any, event: Event): void {

    if (this.purchaseOrder?.status !== 'DRAFT') return;

    const val = +(event.target as HTMLInputElement).value;
    if (val > 0) item.quantity = val;

  }

  updatePrice(item: any, event: Event): void {

    if (this.purchaseOrder?.status !== 'DRAFT') return;

    const val = +(event.target as HTMLInputElement).value;
    if (val >= 0) item.import_price = val;

  }

  removeItem(index: number): void {

    if (this.purchaseOrder?.status !== 'DRAFT') return;

    this.items.splice(index, 1);

  }

  /* ================= TOTAL ================= */

  get totalQuantity(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalAmount(): number {
    return this.items.reduce((sum, i) => sum + (i.quantity * (i.import_price || 0)), 0);
  }

  /* ================= ACTION ================= */

  confirm(): void {

    if (!this.orderId) return;

    this.isLoading = true;

    this.inventoryService.confirmPurchaseOrder(this.orderId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({

        next: () => {
          toast.success('Xác nhận nhập kho thành công');
          this.loadDetail();
        },

        error: () => {
          toast.error('Xác nhận thất bại');
        }

      });

  }

  goBack(): void {
    this.router.navigate(['/inventory/purchase-orders']);
  }

}