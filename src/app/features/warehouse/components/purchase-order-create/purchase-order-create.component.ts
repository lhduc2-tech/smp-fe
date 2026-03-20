import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

import { InventoryFlowService } from '../../services/inventory-flow.service';

import { ProductService } from '../../../product/services/product.service';
import { Product } from '../../../product/models/product.model';

import { SupplierService } from '../../../supplier/services/supplier.service';
import { Supplier } from '../../../supplier/models/supplier.model';

import { LucideAngularModule, Package, ArrowLeft } from 'lucide-angular';

import { toast } from 'ngx-sonner';
import { finalize } from 'rxjs';

import { ZardComboboxOption } from '../../../../shared/components/combobox/combobox.component';

@Component({
  selector: 'app-purchase-order-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ...SHARED_UI_IMPORTS,
    LucideAngularModule
  ],
  templateUrl: './purchase-order-create.component.html',
  styleUrls: ['./purchase-order-create.component.css']
})
export class PurchaseOrderCreateComponent implements OnInit {

  /* ================= ICON ================= */
  readonly iconPackage = Package;
  readonly iconBack = ArrowLeft;

  /* ================= STATE ================= */
  isLoading = false;

  /* ================= SUPPLIER ================= */
  suppliers: Supplier[] = [];
  supplierOptions: ZardComboboxOption[] = [];
  selectedSupplier?: Supplier;

  /* ================= PRODUCT ================= */
  products: Product[] = [];
  productOptions: ZardComboboxOption[] = [];

  /* ================= FORM DATA ================= */
  items: any[] = [];
  note: string = '';

  constructor(
    private router: Router,
    private inventoryService: InventoryFlowService,
    private productService: ProductService,
    private supplierService: SupplierService
  ) {}

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.loadSuppliers();
    this.loadProducts();
  }

  /* ================= LOAD ================= */

  loadSuppliers(): void {
    this.supplierService.getAll().subscribe({
      next: (res) => {
        this.suppliers = res;

        this.supplierOptions = res.map(s => ({
          value: s.id,
          label: `${s.supplierName } — ${s.phoneNumber}`
        }));
      }
    });
  }

  loadProducts(): void {
    this.productService.getAllProductByShopId().subscribe({
      next: (products) => {
        this.products = products;

        this.productOptions = products.map(p => ({
          value: p.id,
          label: `${p.name} — ${p.code}`
        }));
      }
    });
  }

  /* ================= SELECT ================= */

  onSupplierSelected(option: ZardComboboxOption): void {
    this.selectedSupplier = this.suppliers.find(s => s.id === option.value);
  }

  onProductSelected(option: ZardComboboxOption): void {

    const product = this.products.find(p => p.id === option.value);
    if (!product) return;

    const existing = this.items.find(i => i.productId === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        importPrice: product.price || 0
      });
    }
  }

  /* ================= ITEM ACTION ================= */

  increaseQty(item: any): void {
    item.quantity++;
  }

  decreaseQty(item: any): void {
    if (item.quantity > 1) item.quantity--;
  }

  updateQty(item: any, event: Event): void {
    const val = +(event.target as HTMLInputElement).value;
    if (val > 0) item.quantity = val;
  }

  updatePrice(item: any, event: Event): void {
    const val = +(event.target as HTMLInputElement).value;
    if (val >= 0) item.importPrice = val;
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  /* ================= TOTAL ================= */

  get totalQuantity(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalAmount(): number {
    return this.items.reduce(
      (sum, i) => sum + (i.quantity * (i.importPrice || 0)),
      0
    );
  }

  /* ================= CREATE ================= */

  createOrder(): void {

    if (!this.selectedSupplier) {
      toast.error('Vui lòng chọn nhà cung cấp');
      return;
    }

    if (this.items.length === 0) {
      toast.error('Vui lòng thêm sản phẩm');
      return;
    }

    const payload = {
      supplierId: this.selectedSupplier.id,
      note: this.note,
      items: this.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        importPrice: i.importPrice
      }))
    };

    this.isLoading = true;

    this.inventoryService.createPurchaseOrder(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          toast.success('Tạo phiếu nhập thành công');
          this.goBack();
        },
        error: () => {
          toast.error('Tạo thất bại');
        }
      });

  }

  /* ================= NAV ================= */

  goBack(): void {
    this.router.navigate(['/inventory/purchase-orders']);
  }

}