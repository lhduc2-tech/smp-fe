import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';
import { ChangeDetectorRef } from '@angular/core';
import { InventoryFlowService } from '../../services/inventory-flow.service';

import { ProductService } from '../../../product/services/product.service';
import { Product } from '../../../product/models/product.model';

import { SupplierService } from '../../../supplier/services/supplier.service';
import { Supplier } from '../../../supplier/models/supplier.model';

import { LucideAngularModule, Package, ArrowLeft } from 'lucide-angular';

import { toast } from 'ngx-sonner';
import { finalize, forkJoin } from 'rxjs';

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
  isViewMode = false;
  orderId?: string;
  /* ================= SUPPLIER ================= */
  suppliers: Supplier[] = [];
  supplierOptions: ZardComboboxOption[] = [];
  selectedSupplier?: Supplier;

  /* ================= CREATE SUPPLIER ================= */
  isCreatingSupplier = false;

  newSupplier: Partial<Supplier> = {
    supplierName: '',
    code: '',
    phoneNumber: '',
    email: '',
    website: '',
    taxCode: ''
  };
  /* ================= PRODUCT ================= */
  products: Product[] = [];
  productOptions: ZardComboboxOption[] = [];

  /* ================= CREATE PRODUCT ================= */
  isCreatingProduct = false;

  newProduct: Partial<Product> = {
    name: '',
    code: '',
    price: 0
  };
  /* ================= FORM DATA ================= */
  items: {
    productId: string;
    productName: string;
    quantity: number;
    importPrice?: number;
  }[] = [];

  note: string = '';
  preSelectedProductId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inventoryService: InventoryFlowService,
    private productService: ProductService,
    private supplierService: SupplierService,
    private cd: ChangeDetectorRef
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.resolveMode();
    this.loadSuppliers();
    this.loadProducts();
    this.checkQueryBatch();

    if (this.isViewMode) {
      this.loadOrderDetail();
    }
  }

  private resolveMode(): void {
    const url = this.router.url;

    if (url.includes('/view/')) {
      this.isViewMode = true;
      this.orderId = this.router.url.split('/').pop();
    }
  }
  private checkQueryBatch(): void {
    this.route.queryParams.subscribe(params => {
      this.preSelectedProductId = params['productId'] || null;
      this.tryAutoAddProduct();
    });
  }

  private tryAutoAddProduct(): void {
    if (this.preSelectedProductId && this.products.length > 0) {
      const product = this.products.find(p => p.id === this.preSelectedProductId);
      if (product) {
        this.addProductToOrder(product);
        // Clear param after adding to avoid re-adding on manual interactions if any
        this.preSelectedProductId = null;
        this.cd.detectChanges();
      }
    }
  }
  /* =======Load view ===========*/

  loadOrderDetail(): void {
  if (!this.orderId) return;

  this.isLoading = true;

  this.inventoryService.getPurchaseOrderById(this.orderId)
    .subscribe({
      next: (po) => {
        console.log('PO DETAIL:', po); 
        // supplier
        this.selectedSupplier = {
          id: po.supplierId,
          supplierName: po.supplierName
        } as any;

        // items
        this.items = po.items.map(i => ({
          productId: i.productId,
          productName: i.product_name || '',
          quantity: i.quantity,
          importPrice: i.importPrice
        }));

        // note
        this.note = po.note || '';
        this.cd.detectChanges();
      },
      error: () => {
        toast.error('Không tải được chi tiết phiếu nhập');
        this.goBack();
      },
      complete: () => {
        this.isLoading = false;
      }
    });
}
  /* ================= LOAD ================= */

  loadSuppliers(): void {
    this.supplierService.getAll().subscribe({
      next: (res) => {
        this.suppliers = res;

        this.supplierOptions = res.map(s => ({
          value: s.id,
          label: `${s.supplierName} — ${s.phoneNumber}`
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
        this.tryAutoAddProduct();
      }
    });
  }

  private resetNewSupplier(): void {
  this.newSupplier = {
    supplierName: '',
    code: '',
    phoneNumber: '',
    email: '',
    website: '',
    taxCode: ''
  };
}

  toggleCreateSupplier(): void {
  this.isCreatingSupplier = !this.isCreatingSupplier;

  if (this.isCreatingSupplier) {
    this.selectedSupplier = undefined;
  } else {
    this.resetNewSupplier();
  }
}

toggleCreateProduct(): void {
  this.isCreatingProduct = !this.isCreatingProduct;

  if (this.isCreatingProduct) {
    // clear combobox select
  } else {
    this.resetNewProduct();
  }
}

private resetNewProduct(): void {
  this.newProduct = {
    name: '',
    code: '',
    price: 0
  };
}
  /* ================= SELECT ================= */

onSupplierSelected(option: ZardComboboxOption): void {
  const supplier = this.suppliers.find(s => s.id === option.value);
  if (supplier) {
    this.selectedSupplier = supplier;
    this.isCreatingSupplier = false;
  }
}

onProductSelected(option: ZardComboboxOption): void {
  const product = this.products.find(p => p.id === option.value);
  if (!product) return;

  this.addProductToOrder(product);
}
  createProductInline(): void {

  if (!this.newProduct.name || !this.newProduct.code) {
    toast.error('Vui lòng nhập đầy đủ thông tin sản phẩm');
    return;
  }

  this.productService.addProduct(this.newProduct)
    .subscribe({
      next: (product) => {

        // 1. Add vào list product
        this.products.push(product);

        // 2. Add vào combobox
        this.productOptions.unshift({
          value: product.id,
          label: `${product.name} — ${product.code}`
        });

        // 3. AUTO ADD vào bảng items (QUAN TRỌNG)
        this.items.push({
          productId: product.id,
          productName: product.name,
          quantity: 1,
          importPrice: product.price || 0
        });

        // 4. Reset form
        this.newProduct = {
          name: '',
          code: '',
          price: 0
        };

        // 5. Đóng form create (UX chuẩn)
        this.isCreatingProduct = false;

        toast.success('Tạo & thêm sản phẩm thành công');
      },
      error: () => {
        toast.error('Tạo sản phẩm thất bại');
      }
    });
}

private addProductToOrder(product: Product): void {

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

  /* ================= CREATE FLOW ================= */

  createOrder(): void {

  // ❌ chưa chọn gì
  if (!this.selectedSupplier && !this.isCreatingSupplier) {
    toast.error('Vui lòng chọn hoặc tạo nhà cung cấp');
    return;
  }

  if (this.items.length === 0) {
    toast.error('Vui lòng thêm sản phẩm');
    return;
  }

  this.isLoading = true;

  
  // ================= CASE 1: CREATE NEW SUPPLIER =================
  if (this.isCreatingSupplier) {

    // validate
    if (!this.newSupplier.supplierName ||
        !this.newSupplier.code ||
        !this.newSupplier.phoneNumber) {

      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
      this.isLoading = false;
      return;
    }

    this.supplierService.addSupplier(this.newSupplier)
      .subscribe({
        next: (supplier) => {

          // 👉 set selected
          this.selectedSupplier = supplier;

          // 👉 add vào list (UX tốt)
          this.suppliers.push(supplier);
          this.supplierOptions.push({
            value: supplier.id,
            label: `${supplier.supplierName} — ${supplier.phoneNumber}`
          });

          // 👉 reset form
          this.isCreatingSupplier = false;
          this.resetNewSupplier();

          // 👉 tiếp tục tạo order
          this.createPurchaseOrderFlow();
        },
        error: () => {
          this.isLoading = false;
          toast.error('Tạo nhà cung cấp thất bại');
        }
      });

  } else {
    // ================= CASE 2: USE EXISTING =================
    this.createPurchaseOrderFlow();
  }
}
private createPurchaseOrderFlow(): void {

  this.inventoryService.createPurchaseOrder({
    supplierId: this.selectedSupplier!.id,
    note: this.note
  })
  .subscribe({
    next: (poId: string) => {

      const requests = this.items.map(item =>
        this.inventoryService.addItemToPurchaseOrder(poId, {
          productId: item.productId,
          quantity: item.quantity,
          importPrice: item.importPrice
        })
      );

      forkJoin(requests)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {

            this.inventoryService.confirmPurchaseOrder(poId)
              .subscribe({
                next: () => {
                  toast.success('Tạo & nhập kho thành công');
                  this.goBack();
                },
                error: () => {
                  toast.error('Confirm thất bại');
                }
              });

          },
          error: () => {
            toast.error('Thêm sản phẩm thất bại');
          }
        });

    },
    error: () => {
      this.isLoading = false;
      toast.error('Tạo phiếu nhập thất bại');
    }
  });
}
  /* ================= NAV ================= */

  goBack(): void {
    this.router.navigate(['/inventory/purchase-orders']);
  }

}