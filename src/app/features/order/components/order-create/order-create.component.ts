import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';
import { OrderService } from '../../services/order.service';
import { CreateOrderRequest } from '../../models/order.model';
import { ProductService } from '../../../product/services/product.service';
import { Product } from '../../../product/models/product.model';
import { CustomerService } from '../../../customer/services/customer.service';
import { Customer } from '../../../customer/models/customer.model';
import { AuthService } from '../../../auth/services/auth.service';
import { toast } from 'ngx-sonner';
import { type ZardComboboxOption } from '../../../../shared/components/combobox/combobox.component';
import {
    LucideAngularModule,
    User,
    Package,
    CreditCard,
    ShoppingCart,
    Info,
    Copy,
    Search,
    X
} from 'lucide-angular';

export interface OrderProductItem {
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

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

    /* ====== Icons ====== */
    readonly iconUser = User;
    readonly iconPackage = Package;
    readonly iconCreditCard = CreditCard;
    readonly iconShoppingCart = ShoppingCart;
    readonly iconInfo = Info;
    readonly iconCopy = Copy;
    readonly iconSearch = Search;
    readonly iconX = X;

    /* ====== Customers ====== */
    customers: Customer[] = [];
    customerOptions: ZardComboboxOption[] = [];
    selectedCustomerValue = '';

    /* ====== Products ====== */
    products: Product[] = [];
    productOptions: ZardComboboxOption[] = [];
    orderItems: OrderProductItem[] = [];

    /* ====== Payment ====== */
    selectedPaymentMethod = 'BANK_TRANSFER';
    selectedOrderOrigin = 'ONLINE';
    selectedDeliveryService = 'GHN';

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
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.loadCustomers();
        this.loadProducts();
    }

    /* ================= FORM ================= */

    private initForm(): void {
        this.form = this.fb.group({
            customerName: ['', Validators.required],
            customerPhone: [''],
            deliveryAddress: [''],
            note: [''],
            voucherCode: ['']
        });
    }

    /* ================= LOAD DATA ================= */

    private loadCustomers(): void {
        this.customerService.getCustomers().subscribe({
            next: (res) => {
                this.customers = res;
                this.customerOptions = res.map(c => ({
                    value: c.id,
                    label: c.name + (c.phone ? ` — ${c.phone}` : '')
                }));
            },
            error: () => {
                toast.error('Không thể tải danh sách khách hàng');
            }
        });
    }

    private loadProducts(): void {
        this.productService.getProductPage({ page: 0, size: 100 }).subscribe({
            next: (res) => {
                this.products = res.content;
                this.productOptions = res.content.map(p => ({
                    value: p.id,
                    label: `${p.name} — ${p.code} — ${p.price.toLocaleString()}đ`
                }));
            },
            error: () => {
                toast.error('Không thể tải danh sách sản phẩm');
            }
        });
    }

    /* ================= CUSTOMER SELECT ================= */

    onCustomerSelected(option: ZardComboboxOption): void {
        const customer = this.customers.find(c => c.id === option.value);
        if (customer) {
            this.form.patchValue({
                customerName: customer.name,
                customerPhone: customer.phone || '',
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

    /* ================= TOTALS ================= */

    get subtotal(): number {
        return this.orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    }

    get discount(): number {
        if (this.appliedVoucher === 'SALE_ADMIN_2024') {
            // Apply 5% discount if payment is BANK_TRANSFER
            if (this.selectedPaymentMethod === 'BANK_TRANSFER') {
                return this.subtotal * 0.05;
            }
        }
        return 0;
    }

    applyVoucher(): void {
        const code = this.form.get('voucherCode')?.value?.trim()?.toUpperCase();

        if (!code) {
            toast.error('Vui lòng nhập mã giảm giá');
            return;
        }

        if (code === 'SALE_ADMIN_2024') {
            if (this.selectedPaymentMethod !== 'BANK_TRANSFER') {
                toast.error('Mã SALE_ADMIN_2024 chỉ áp dụng cho chuyển khoản ngân hàng');
                return;
            }
            this.appliedVoucher = code;
            toast.success(`Áp dụng mã ${code} thành công: Giảm 5%`);
        } else {
            toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
            this.appliedVoucher = null;
        }
    }

    removeVoucher(): void {
        this.appliedVoucher = null;
        this.form.patchValue({ voucherCode: '' });
        toast.info('Đã gỡ mã giảm giá');
    }

    copyVoucher(): void {
        const voucherCode = 'SALE_ADMIN_2024';
        navigator.clipboard.writeText(voucherCode).then(() => {
            toast.success('Đã sao chép mã giảm giá');
        }).catch(() => {
            toast.error('Không thể sao chép mã giảm giá');
        });
    }

    get shippingFee(): number {
        return this.orderItems.length > 0 ? 30000 : 0;
    }

    get grandTotal(): number {
        return this.subtotal - this.discount + this.shippingFee;
    }

    /* ================= SUBMIT ================= */

    submit(): void {
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

        const request: CreateOrderRequest = {
            orderDate: new Date().toISOString(),
            customerName: this.form.get('customerName')?.value,
            orderOrigin: this.selectedOrderOrigin,
            price: this.grandTotal,
            paymentState: 'PENDING',
            processState: 'NEW',
            deliveryService: this.selectedDeliveryService,
            shopId: shopId,
            createdBy: username || '',
            updatedBy: username || ''
        };

        this.isLoading = true;

        this.orderService.createOrder(request).subscribe({
            next: () => {
                toast.success('Tạo đơn hàng thành công!');
                this.router.navigate(['/orders']);
            },
            error: () => {
                toast.error('Tạo đơn hàng thất bại');
                this.isLoading = false;
            }
        });
    }

    cancel(): void {
        this.router.navigate(['/orders']);
    }
}
