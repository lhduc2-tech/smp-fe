import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';

import { OrderService } from '../../services/order.service';
import { CreateOrderRequest, Order } from '../../models/order.model';

import { ProductService } from '../../../product/services/product.service';
import { Product } from '../../../product/models/product.model';

import { CustomerService } from '../../../customer/services/customer.service';
import { Customer, CustomerRequest } from '../../../customer/models/customer.model';

import { AuthService } from '../../../auth/services/auth.service';

import { toast } from 'ngx-sonner';

import { forkJoin, of, switchMap } from 'rxjs';

import { type ZardComboboxOption } from '../../../../shared/components/combobox/combobox.component';

import {
  LucideAngularModule,
  User,
  UserPlus,
  Package,
  CreditCard,
  ShoppingCart,
  Info,
  Copy,
  X,
  Check
} from 'lucide-angular';

/* ================= INTERFACE ================= */

export interface OrderProductItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/* ================= COMPONENT ================= */

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ...SHARED_UI_IMPORTS,
    LucideAngularModule
  ],
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {

  form!: FormGroup;

  isLoading = false;
  appliedVoucher: string | null = null;

  orderId?: string;
  isViewMode = false;
  isPaid = false;
  currentOrder?: Order;

  /* ================= ICONS ================= */

  readonly iconUser = User;
  readonly iconUserPlus = UserPlus;
  readonly iconPackage = Package;
  readonly iconCreditCard = CreditCard;
  readonly iconShoppingCart = ShoppingCart;
  readonly iconInfo = Info;
  readonly iconCopy = Copy;
  readonly iconX = X;
  readonly iconCheck = Check;

  /* ================= CUSTOMERS ================= */

  customers: Customer[] = [];
  customerOptions: ZardComboboxOption[] = [];
  isNewCustomer = false;
  isSavingCustomer = false;

  /* ================= PRODUCTS ================= */

  products: Product[] = [];
  productOptions: ZardComboboxOption[] = [];

  orderItems: OrderProductItem[] = [];

  /* ================= PAYMENT ================= */

  selectedPaymentMethod = 'BANK_TRANSFER';
  selectedOrderOrigin = 'ONLINE';
  selectedDeliveryService = 'GHN';
 selectedCustomerValue = '';
  paymentMethods = [
    { value: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng' },
    { value: 'CASH', label: 'Tiền mặt' },
    { value: 'CARD', label: 'Thẻ tín dụng / ghi nợ' }
  ];

  orderOrigins = [
    { value: 'ONLINE', label: 'Online' },
    { value: 'IN_STORE', label: 'Tại cửa hàng' },
    { value: 'PHONE', label: 'Qua điện thoại' }
  ];

  deliveryServices = [
    { value: 'GHTK', label: 'Giao hàng tiết kiệm' },
    { value: 'GHN', label: 'Giao hàng nhanh' },
    { value: 'VIETTEL_POST', label: 'Viettel Post' },
    { value: 'SELF', label: 'Tự giao' }
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {

    this.initForm();

    this.orderId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isViewMode = !!this.orderId;

    this.loadInitialData();
  }

  /* ================= FORM ================= */

  private initForm(): void {

    this.form = this.fb.group({
      customerName: ['', Validators.required],
      customerPhone: [''],
      customerEmail: [''],
      deliveryAddress: [''],
      note: [''],
      voucherCode: ['']
    });

  }

  /* ================= LOAD INITIAL DATA ================= */

  private loadInitialData(): void {

    const products$ = this.productService.getAllProductByShopId();
    const customers$ = this.customerService.getAll();
    const order$ = this.orderId ? this.orderService.getOrderById(this.orderId) : of(null);

    forkJoin({
      products: products$,
      customers: customers$,
      order: order$
    }).subscribe({

      next: ({ products, customers, order }) => {

        /* ===== PRODUCTS ===== */

        this.products = products;

        this.productOptions = this.products.map(p => ({
          value: p.id,
          label: `${p.name} — ${p.code} — ${p.price.toLocaleString()}đ`
        }));

        /* ===== CUSTOMERS ===== */

        this.customers = customers;

        this.customerOptions = customers.map(c => ({
          value: c.id,
          label: c.fullName + (c.phoneNumber ? ` — ${c.phoneNumber}` : '')
        }));

        /* ===== ORDER ===== */

        if (order) {
          this.populateOrder(order);
        }

      },

      error: () => {
        toast.error('Không thể tải dữ liệu hệ thống');
      }

    });

  }

  /* ================= POPULATE ORDER ================= */

  private populateOrder(order: Order): void {
  this.currentOrder = order;

  const customer = this.customers.find(
    c => c.fullName === order.customerName
  );

  this.form.patchValue({
    customerName: order.customerName,
    customerPhone: customer?.phoneNumber || '',
    customerEmail: customer?.email || '',
    deliveryAddress: customer?.address || '',
    note: order.description || ''
  });

  if (customer) {
    this.selectedCustomerValue = customer.id;
  }

  this.selectedOrderOrigin = order.orderOrigin;
  this.selectedDeliveryService = order.deliveryService;

  this.isPaid = order.paymentState === 'PAID';
  if (this.isPaid) {
    this.form.disable();
  }

  /* ===== ORDER ITEMS ===== */

  this.orderItems = order.orderItems.map(item => {

    const product = this.products.find(
      p => p.id === (item.productId || (item as any).product_id)
    );

    if (!product) return null;

    return {
      product,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice
    };

  }).filter(Boolean) as OrderProductItem[];

}

  /* ================= CUSTOMER MODE TOGGLE ================= */

  toggleCustomerMode(): void {
    this.isNewCustomer = !this.isNewCustomer;
    this.selectedCustomerValue = '';
    this.form.patchValue({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      deliveryAddress: ''
    });
  }

  /* ================= CUSTOMER SELECT ================= */

  onCustomerSelected(option: ZardComboboxOption): void {

    const customer = this.customers.find(c => c.id === option.value);

    if (customer) {
      this.selectedCustomerValue = customer.id;
      this.form.patchValue({
        customerName: customer.fullName,
        customerPhone: customer.phoneNumber || '',
        customerEmail: customer.email || '',
        deliveryAddress: customer.address || ''
      });
    }

  }

  /* ================= PRODUCT SELECT ================= */

  onProductSelected(option: ZardComboboxOption): void {

    const product = this.products.find(p => p.id === option.value);
    if (!product) return;

    const existing = this.orderItems.find(i => i.product.id === product.id);

    if (existing) {

      existing.quantity += 1;
      existing.totalPrice = existing.quantity * existing.unitPrice;

    } else {

      this.orderItems.push({
        product,
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price
      });

    }

  }

  /* ================= ORDER ITEMS ================= */

  increaseQty(item: OrderProductItem): void {

    item.quantity += 1;
    item.totalPrice = item.quantity * item.unitPrice;

  }

  decreaseQty(item: OrderProductItem): void {

    if (item.quantity > 1) {
      item.quantity -= 1;
      item.totalPrice = item.quantity * item.unitPrice;
    }

  }

  updateQty(item: OrderProductItem, event: Event): void {

    const input = event.target as HTMLInputElement;
    const val = parseInt(input.value, 10);

    if (val > 0) {
      item.quantity = val;
      item.totalPrice = item.quantity * item.unitPrice;
    }

  }

  removeItem(index: number): void {
    this.orderItems.splice(index, 1);
  }

  /* ================= TOTAL ================= */

  get subtotal(): number {
    return this.orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  get discount(): number {

    if (this.appliedVoucher === 'SALE_ADMIN_2024' && this.selectedPaymentMethod === 'BANK_TRANSFER') {
      return this.subtotal * 0.05;
    }

    return 0;
  }

  get shippingFee(): number {
    return this.orderItems.length > 0 ? 30000 : 0;
  }

  get grandTotal(): number {
    return this.subtotal - this.discount + this.shippingFee;
  }

  /* ================= VOUCHER ================= */

  applyVoucher(): void {

    const code = this.form.get('voucherCode')?.value?.trim()?.toUpperCase();

    if (!code) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    if (code === 'SALE_ADMIN_2024') {

      if (this.selectedPaymentMethod !== 'BANK_TRANSFER') {
        toast.error('Mã SALE_ADMIN_2024 chỉ áp dụng cho chuyển khoản');
        return;
      }

      this.appliedVoucher = code;

      toast.success(`Áp dụng mã ${code} thành công`);

    } else {

      toast.error('Mã giảm giá không hợp lệ');

    }

  }

  removeVoucher(): void {

    this.appliedVoucher = null;

    this.form.patchValue({
      voucherCode: ''
    });

    toast.info('Đã gỡ mã giảm giá');

  }

  copyVoucher(): void {

    const code = 'SALE_ADMIN_2024';

    navigator.clipboard.writeText(code).then(() => {
      toast.success('Đã sao chép mã');
    });

  }

  /* ================= SUBMIT ================= */

  submit(): void {

    if (this.isViewMode) return;

    if (this.form.invalid || this.orderItems.length === 0) {

      this.form.markAllAsTouched();

      if (this.orderItems.length === 0) {
        toast.error('Vui lòng thêm ít nhất một sản phẩm');
      }

      return;
    }

    const shopId = this.authService.shopId;
    const username = this.authService.username;

    if (!shopId) {
      toast.error('Không tìm thấy thông tin cửa hàng');
      return;
    }

    this.isLoading = true;

    /* === Nếu là khách mới → tạo customer trước, rồi tạo order === */
    if (this.isNewCustomer) {

      const customerName = this.form.get('customerName')?.value?.trim();
      const customerPhone = this.form.get('customerPhone')?.value?.trim();
      const customerEmail = this.form.get('customerEmail')?.value?.trim();
      const deliveryAddress = this.form.get('deliveryAddress')?.value?.trim();

      if (!customerName) {
        toast.error('Vui lòng nhập tên khách hàng');
        this.isLoading = false;
        return;
      }

      const customerReq: CustomerRequest = {
        fullName: customerName,
        phoneNumber: customerPhone || undefined,
        email: customerEmail || undefined,
        address: deliveryAddress || undefined,
        shopId: shopId,
        createdBy: username || '',
        updatedBy: username || ''
      };

      this.isSavingCustomer = true;

      this.customerService.addCustomer(customerReq).pipe(
        switchMap((newCustomer) => {

          /* Thêm customer mới vào danh sách local */
          this.customers.push(newCustomer);
          this.selectedCustomerValue = newCustomer.id;
          this.isSavingCustomer = false;

          const request: CreateOrderRequest = {
            orderDate: new Date().toISOString(),
            customerId: newCustomer.id,
            orderOrigin: this.selectedOrderOrigin,
            price: this.grandTotal,
            paymentState: 'PENDING',
            processState: 'NEW',
            deliveryService: this.selectedDeliveryService,
            shopId: shopId,
            createdBy: username || '',
            updatedBy: username || '',
            paymentMethod: this.selectedPaymentMethod,
            description: this.form.get('note')?.value || '',
            orderItems: this.orderItems.map(item => ({
              productId: item.product.id,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              createdBy: username || '',
              updatedBy: username || ''
            }))
          };

          return this.orderService.createOrder(request);
        })
      ).subscribe({
        next: () => {
          toast.success('Tạo khách hàng và đơn hàng thành công');
          this.router.navigate(['/orders']);
        },
        error: () => {
          toast.error('Tạo đơn hàng thất bại');
          this.isLoading = false;
          this.isSavingCustomer = false;
        }
      });

    } else {

      /* === Khách hàng cũ → tạo order trực tiếp === */
      const request: CreateOrderRequest = {
        orderDate: new Date().toISOString(),
        customerId: this.selectedCustomerValue || undefined,
        orderOrigin: this.selectedOrderOrigin,
        price: this.grandTotal,
        paymentState: 'PENDING',
        processState: 'NEW',
        deliveryService: this.selectedDeliveryService,
        shopId: shopId,
        createdBy: username || '',
        updatedBy: username || '',
        paymentMethod: this.selectedPaymentMethod,
        description: this.form.get('note')?.value || '',
        orderItems: this.orderItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          createdBy: username || '',
          updatedBy: username || ''
        }))
      };

      this.orderService.createOrder(request).subscribe({
        next: () => {
          toast.success('Tạo đơn hàng thành công');
          this.router.navigate(['/orders']);
        },
        error: () => {
          toast.error('Tạo đơn hàng thất bại');
          this.isLoading = false;
        }
      });

    }

  }

  /* ================= UPDATE ================= */
  update(): void {
    if (!this.orderId || !this.currentOrder || this.form.invalid || this.orderItems.length === 0) {
      this.form.markAllAsTouched();
      if (this.orderItems.length === 0) {
        toast.error('Vui lòng thêm ít nhất một sản phẩm');
      }
      return;
    }

    const shopId = this.authService.shopId;
    const username = this.authService.username;

    this.isLoading = true;

    const request: any = {
      orderDate: this.currentOrder.orderDate,
      customerId: this.selectedCustomerValue || undefined,
      orderOrigin: this.selectedOrderOrigin,
      price: this.grandTotal,
      paymentState: this.currentOrder.paymentState,
      processState: this.currentOrder.processState,
      deliveryService: this.selectedDeliveryService,
      shopId: shopId || undefined,
      updatedBy: username || '',
      paymentMethod: this.selectedPaymentMethod,
      description: this.form.get('note')?.value || '',
      orderItems: this.orderItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        createdBy: this.currentOrder?.createdBy || username || '',
        updatedBy: username || ''
      }))
    };

    this.orderService.updateOrder(this.orderId, request).subscribe({
      next: () => {
        toast.success('Cập nhật đơn hàng thành công');
        this.isLoading = false;
        this.router.navigate(['/orders']);
      },
      error: () => {
        toast.error('Cập nhật đơn hàng thất bại');
        this.isLoading = false;
      }
    });

  }

  /* ================= CANCEL ================= */

  cancel(): void {
    this.router.navigate(['/orders']);
  }

}
