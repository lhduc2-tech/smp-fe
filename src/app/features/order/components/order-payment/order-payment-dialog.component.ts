import { Component, Injectable, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  CreditCard,
  Banknote,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Receipt,
  ExternalLink,
  ShieldCheck
} from 'lucide-angular';

import { SHARED_UI_IMPORTS } from '../../../../shared/components/ui';
import { Order, UpdateOrderRequest } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { VnpayPaymentService } from '../../services/vnpay-payment.service';
import { toast } from 'ngx-sonner';

/* ================================================================
   ORDER PAYMENT SERVICE – signal-based dialog (like ConfirmService)
   ================================================================ */

@Injectable({
  providedIn: 'root'
})
export class OrderPaymentService {

  dialogState = signal<{
    isOpen: boolean;
    order: Order | null;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    order: null,
    resolve: null
  });

  open(order: Order): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialogState.set({
        isOpen: true,
        order,
        resolve
      });
    });
  }

  close(result: boolean) {
    const state = this.dialogState();
    if (state.resolve) {
      state.resolve(result);
    }
    this.dialogState.set({
      isOpen: false,
      order: null,
      resolve: null
    });
  }
}

/* ================================================================
   ORDER PAYMENT DIALOG COMPONENT
   ================================================================ */

@Component({
  selector: 'app-order-payment-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ...SHARED_UI_IMPORTS],
  template: `
    @if (paymentService.dialogState().isOpen) {
      <div class="payment-overlay" (click)="cancel()">
        <div class="payment-dialog" (click)="$event.stopPropagation()">

          <!-- HEADER -->
          <div class="payment-header">
            <div class="payment-header-left">
              <lucide-icon [img]="iconReceipt" [size]="22" class="text-primary"></lucide-icon>
              <h3>Thanh toán đơn hàng</h3>
            </div>
            <button class="close-btn" (click)="cancel()">&times;</button>
          </div>

          <!-- ORDER INFO -->
          <div class="payment-body">

            <div class="order-info-card">
              <div class="order-info-row">
                <span class="info-label">Đơn hàng</span>
                <span class="info-value font-semibold">{{ order?.orderName }}</span>
              </div>
              <div class="order-info-row">
                <span class="info-label">Khách hàng</span>
                <span class="info-value">{{ order?.customerName }}</span>
              </div>
              <div class="order-info-row">
                <span class="info-label">Trạng thái</span>
                <span class="status-badge"
                  [class.status-pending]="order?.paymentState === 'PENDING'"
                  [class.status-paid]="order?.paymentState === 'PAID'"
                  [class.status-failed]="order?.paymentState === 'FAILED'">
                  <lucide-icon
                    [img]="order?.paymentState === 'PAID' ? iconCheck : order?.paymentState === 'FAILED' ? iconXCircle : iconClock"
                    [size]="14">
                  </lucide-icon>
                  {{ paymentStateLabel }}
                </span>
              </div>
              <div class="order-info-divider"></div>
              <div class="order-info-row total-row">
                <span class="info-label">Tổng thanh toán</span>
                <span class="info-total">{{ order?.price | number:'1.0-0' }}đ</span>
              </div>
            </div>

            <!-- PAYMENT METHOD SELECTION -->
            <div class="method-section">
              <label class="method-label">Chọn phương thức thanh toán</label>
              <div class="method-grid">
                <button
                  class="method-card"
                  [class.method-active]="selectedMethod === 'CASH'"
                  (click)="selectMethod('CASH')">
                  <lucide-icon [img]="iconBanknote" [size]="28"></lucide-icon>
                  <span class="method-name">Tiền mặt</span>
                </button>
                <button
                  class="method-card vnpay-card"
                  [class.method-active]="selectedMethod === 'VNPAY'"
                  (click)="selectMethod('VNPAY')">
                  <div class="vnpay-logo-small">
                    <span class="vnpay-text-vn">VN</span><span class="vnpay-text-pay">PAY</span>
                  </div>
                  <span class="method-name">VNPay</span>
                </button>
                <button
                  class="method-card"
                  [class.method-active]="selectedMethod === 'CARD'"
                  (click)="selectMethod('CARD')">
                  <lucide-icon [img]="iconCreditCard" [size]="28"></lucide-icon>
                  <span class="method-name">Thẻ</span>
                </button>
              </div>
            </div>

            <!-- CASH: Tính tiền thừa -->
            @if (selectedMethod === 'CASH') {
              <div class="cash-section">
                <div class="cash-input-group">
                  <label class="cash-label">Khách đưa</label>
                  <div class="cash-input-wrapper">
                    <input
                      type="number"
                      class="cash-input"
                      [class.cash-input-error]="cashReceived > 0 && (cashReceived < 1000 || cashReceived > 999999999)"
                      [(ngModel)]="cashReceived"
                      (ngModelChange)="onCashChange()"
                      placeholder="Nhập số tiền khách đưa"
                      min="1000"
                      max="999999999" />
                    <span class="cash-suffix">đ</span>
                  </div>
                  @if (cashReceived > 0 && cashReceived < 1000) {
                    <span class="cash-error">Số tiền tối thiểu là 1,000đ</span>
                  }
                  @if (cashReceived > 999999999) {
                    <span class="cash-error">Số tiền tối đa là 999,999,999đ</span>
                  }
                </div>

                <!-- Quick amount buttons -->
                <div class="quick-amounts">
                  @for (amount of quickAmounts; track amount) {
                    <button class="quick-btn"
                      [class.quick-active]="selectedQuickAmount === amount"
                      (click)="setCashAmount(amount)">
                      {{ amount | number:'1.0-0' }}đ
                    </button>
                  }
                  <button class="quick-btn"
                    [class.quick-active]="selectedQuickAmount === 'exact'"
                    (click)="setCashExact()">
                    Đúng tiền
                  </button>
                </div>

                <!-- Tiền thừa -->
                @if (cashReceived > 0) {
                  <div class="change-display"
                    [class.change-ok]="changeAmount >= 0"
                    [class.change-insufficient]="changeAmount < 0">
                    <div class="change-row">
                      <span>Cần thanh toán</span>
                      <span class="font-semibold">{{ order?.price | number:'1.0-0' }}đ</span>
                    </div>
                    <div class="change-row">
                      <span>Khách đưa</span>
                      <span class="font-semibold">{{ cashReceived | number:'1.0-0' }}đ</span>
                    </div>
                    <div class="change-divider"></div>
                    <div class="change-row change-result">
                      <span>{{ changeAmount >= 0 ? 'Tiền thừa trả khách' : 'Còn thiếu' }}</span>
                      <span class="change-amount">
                        {{ (changeAmount >= 0 ? changeAmount : -changeAmount) | number:'1.0-0' }}đ
                      </span>
                    </div>
                  </div>
                }
              </div>
            }

            <!-- VNPAY info -->
            @if (selectedMethod === 'VNPAY') {
              <div class="vnpay-section">
                <div class="vnpay-info-card">
                  <div class="vnpay-icon-wrapper">
                    <div class="vnpay-logo">
                      <span class="vnpay-logo-vn">VN</span><span class="vnpay-logo-pay">PAY</span>
                    </div>
                  </div>
                  <div class="vnpay-details">
                    <p class="vnpay-hint">Thanh toán trực tuyến qua cổng <strong>VNPay</strong></p>
                    <p class="vnpay-amount">Số tiền: <strong>{{ order?.price | number:'1.0-0' }}đ</strong></p>
                    <div class="vnpay-features">
                      <span class="vnpay-feature">
                        <lucide-icon [img]="iconShieldCheck" [size]="13"></lucide-icon>
                        Bảo mật SSL
                      </span>
                      <span class="vnpay-feature">
                        <lucide-icon [img]="iconExternalLink" [size]="13"></lucide-icon>
                        Chuyển hướng đến VNPay
                      </span>
                    </div>
                  </div>
                </div>
                <div class="vnpay-note">
                  <lucide-icon [img]="iconShieldCheck" [size]="14"></lucide-icon>
                  <span>Bạn sẽ được chuyển đến trang thanh toán VNPay. Sau khi hoàn tất, hệ thống sẽ tự động cập nhật trạng thái đơn hàng.</span>
                </div>
              </div>
            }

            <!-- CARD info -->
            @if (selectedMethod === 'CARD') {
              <div class="card-section">
                <div class="card-info-card">
                  <div class="card-icon-wrapper">
                    <lucide-icon [img]="iconCreditCard" [size]="32"></lucide-icon>
                  </div>
                  <div class="card-details">
                    <p class="card-hint">Xác nhận đã thanh toán bằng thẻ tín dụng / ghi nợ</p>
                    <p class="card-amount">Số tiền: <strong>{{ order?.price | number:'1.0-0' }}đ</strong></p>
                  </div>
                </div>
              </div>
            }

          </div>

          <!-- FOOTER -->
          <div class="payment-footer">
            <button class="btn-cancel" (click)="cancel()">Hủy bỏ</button>
            <button
              class="btn-confirm-payment"
              [class.btn-vnpay]="selectedMethod === 'VNPAY'"
              [disabled]="!canConfirm || isProcessing"
              (click)="confirmPayment()">
              @if (isProcessing) {
                <lucide-icon [img]="iconLoader" [size]="16" class="spin"></lucide-icon>
                Đang xử lý...
              } @else if (selectedMethod === 'VNPAY') {
                <lucide-icon [img]="iconExternalLink" [size]="16"></lucide-icon>
                Thanh toán qua VNPay
              } @else {
                <lucide-icon [img]="iconCheck" [size]="16"></lucide-icon>
                Xác nhận thanh toán
              }
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    /* ===== Overlay ===== */
    .payment-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(3px);
      animation: fadeIn 0.2s ease-out;
    }

    /* ===== Dialog ===== */
    .payment-dialog {
      background: white;
      border-radius: 16px;
      width: 95%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      animation: scaleIn 0.2s ease-out;
    }

    /* ===== Header ===== */
    .payment-header {
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .payment-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .payment-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      color: #9ca3af;
      padding: 4px 8px;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .close-btn:hover {
      background: #f3f4f6;
      color: #4b5563;
    }

    /* ===== Body ===== */
    .payment-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* ===== Order Info ===== */
    .order-info-card {
      background: #f9fafb;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .order-info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }

    .info-label {
      color: #6b7280;
    }

    .info-value {
      color: #1f2937;
    }

    .order-info-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 4px 0;
    }

    .total-row .info-label {
      font-weight: 600;
      color: #1f2937;
    }

    .info-total {
      font-size: 20px;
      font-weight: 800;
      color: #6366F1;
    }

    /* ===== Status Badge ===== */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-paid {
      background: #d1fae5;
      color: #065f46;
    }

    .status-failed {
      background: #fee2e2;
      color: #991b1b;
    }

    /* ===== Payment Method ===== */
    .method-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .method-label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .method-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .method-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px 8px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      color: #6b7280;
    }

    .method-card:hover {
      border-color: #6366F1;
      background: rgba(99, 102, 241, 0.04);
      color: #6366F1;
    }

    .method-card.method-active {
      border-color: #6366F1;
      background: rgba(99, 102, 241, 0.08);
      color: #6366F1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    .method-name {
      font-size: 13px;
      font-weight: 600;
    }

    /* ===== Cash Section ===== */
    .cash-section {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .cash-input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .cash-label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .cash-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .cash-input {
      width: 100%;
      height: 44px;
      padding: 0 36px 0 16px;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      outline: none;
      transition: border-color 0.2s;
      -moz-appearance: textfield;
      appearance: textfield;
    }

    .cash-input:focus {
      border-color: #6366F1;
    }

    .cash-input-error {
      border-color: #ef4444 !important;
    }

    .cash-error {
      font-size: 12px;
      color: #ef4444;
      margin-top: 4px;
    }

    .cash-input::-webkit-outer-spin-button,
    .cash-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .cash-suffix {
      position: absolute;
      right: 14px;
      color: #9ca3af;
      font-weight: 600;
    }

    /* ===== Quick Amounts ===== */
    .quick-amounts {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .quick-btn {
      padding: 6px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.15s;
    }

    .quick-btn:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }

    .quick-btn.quick-active {
      background: rgba(99, 102, 241, 0.08);
      border-color: #6366F1;
      color: #6366F1;
      font-weight: 600;
    }

    .quick-btn.quick-active:hover {
      background: rgba(99, 102, 241, 0.15);
    }

    /* ===== Change Display ===== */
    .change-display {
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 14px;
    }

    .change-ok {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
    }

    .change-insufficient {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .change-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .change-divider {
      height: 1px;
      background: currentColor;
      opacity: 0.15;
    }

    .change-result {
      font-weight: 700;
      font-size: 15px;
    }

    .change-ok .change-amount {
      color: #059669;
      font-size: 18px;
    }

    .change-insufficient .change-amount {
      color: #dc2626;
      font-size: 18px;
    }

    /* ===== VNPay Section ===== */
    .vnpay-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .vnpay-info-card {
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 16px;
      background: linear-gradient(135deg, #f0f4ff 0%, #e8f4f8 100%);
      border: 1px solid #bfdbfe;
      border-radius: 12px;
    }

    .vnpay-icon-wrapper {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .vnpay-logo {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .vnpay-logo-vn {
      color: #005baa;
    }

    .vnpay-logo-pay {
      color: #e41e2e;
    }

    .vnpay-details {
      flex: 1;
    }

    .vnpay-hint {
      margin: 0;
      font-size: 14px;
      color: #374151;
      line-height: 1.5;
    }

    .vnpay-amount {
      margin: 4px 0 0;
      font-size: 14px;
      color: #6b7280;
    }

    .vnpay-features {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }

    .vnpay-feature {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #059669;
      font-weight: 500;
    }

    .vnpay-note {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 10px 14px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 10px;
      font-size: 12px;
      color: #92400e;
      line-height: 1.5;
    }

    .vnpay-note lucide-icon {
      flex-shrink: 0;
      margin-top: 1px;
    }

    /* VNPay logo in method grid */
    .vnpay-logo-small {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -0.5px;
      line-height: 1;
    }

    .vnpay-text-vn {
      color: #005baa;
    }

    .vnpay-text-pay {
      color: #e41e2e;
    }

    .method-card.vnpay-card.method-active {
      border-color: #005baa;
      background: rgba(0, 91, 170, 0.06);
      box-shadow: 0 0 0 3px rgba(0, 91, 170, 0.12);
    }

    .method-card.vnpay-card:hover {
      border-color: #005baa;
      background: rgba(0, 91, 170, 0.03);
    }

    /* ===== Card Section ===== */
    .card-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .card-info-card {
      display: flex;
      gap: 16px;
      align-items: center;
      padding: 16px;
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 12px;
    }

    .card-icon-wrapper {
      flex-shrink: 0;
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: white;
      color: #7c3aed;
    }

    .card-hint {
      margin: 0;
      font-size: 14px;
      color: #374151;
      line-height: 1.5;
    }

    .card-amount {
      margin: 6px 0 0;
      font-size: 14px;
      color: #6b7280;
    }

    /* ===== Footer ===== */
    .payment-footer {
      padding: 20px 24px;
      background: #fafafa;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid #f0f0f0;
      border-radius: 0 0 16px 16px;
    }

    .btn-vnpay {
      background: linear-gradient(135deg, #005baa 0%, #0074d4 100%) !important;
    }

    .btn-vnpay:hover:not(:disabled) {
      background: linear-gradient(135deg, #004a8c 0%, #005fac 100%) !important;
    }

    .btn-cancel {
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid #d0d0d0;
      background: white;
      color: #333;
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
      line-height: 1;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: #f0f0f0;
    }

    .btn-confirm-payment {
      padding: 10px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      background: #6366F1;
      color: white;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      line-height: 1;
      transition: all 0.2s;
    }

    .btn-confirm-payment lucide-icon,
    .btn-confirm-payment ::ng-deep svg {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      vertical-align: middle;
    }

    .btn-confirm-payment:hover:not(:disabled) {
      background: #4F46E5;
    }

    .btn-confirm-payment:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .font-semibold {
      font-weight: 600;
    }

    .text-primary {
      color: #6366F1;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    /* Responsive */
    @media (max-width: 480px) {
      .payment-dialog {
        width: 100%;
        max-width: 100%;
        border-radius: 16px 16px 0 0;
        max-height: 95vh;
      }

      .method-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .method-card {
        padding: 12px 6px;
      }
    }
  `]
})
export class OrderPaymentDialogComponent {

  /* ===== Icons ===== */
  readonly iconCreditCard = CreditCard;
  readonly iconBanknote = Banknote;
  readonly iconCheck = CheckCircle2;
  readonly iconXCircle = XCircle;
  readonly iconClock = Clock;
  readonly iconLoader = Loader2;
  readonly iconReceipt = Receipt;
  readonly iconExternalLink = ExternalLink;
  readonly iconShieldCheck = ShieldCheck;

  /* ===== State ===== */
  selectedMethod = 'CASH';
  cashReceived = 0;
  isProcessing = false;
  selectedQuickAmount: number | 'exact' | null = null;

  /* ===== Quick amounts for cash ===== */
  quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  constructor(
    public paymentService: OrderPaymentService,
    private orderService: OrderService,
    private vnpayService: VnpayPaymentService
  ) {}

  /* ===== Computed ===== */

  get order(): Order | null {
    return this.paymentService.dialogState().order;
  }

  get paymentStateLabel(): string {
    switch (this.order?.paymentState) {
      case 'PAID': return 'Đã thanh toán';
      case 'FAILED': return 'Thất bại';
      case 'PENDING':
      default: return 'Chờ thanh toán';
    }
  }

  get changeAmount(): number {
    return this.cashReceived - (this.order?.price || 0);
  }

  get canConfirm(): boolean {
    if (!this.selectedMethod) return false;
    if (this.selectedMethod === 'CASH') {
      return this.cashReceived >= 1000 && this.cashReceived <= 999999999 && this.cashReceived >= (this.order?.price || 0);
    }
    return true;
  }

  /* ===== Methods ===== */

  selectMethod(method: string): void {
    this.selectedMethod = method;
    this.cashReceived = 0;
    this.selectedQuickAmount = null;
  }

  setCashAmount(amount: number): void {
    this.cashReceived = amount;
    this.selectedQuickAmount = amount;
  }

  setCashExact(): void {
    this.cashReceived = this.order?.price || 0;
    this.selectedQuickAmount = 'exact';
  }

  onCashChange(): void {
    this.selectedQuickAmount = null;
  }

  confirmPayment(): void {
    if (!this.order || !this.canConfirm || this.isProcessing) return;

    // VNPay: gọi API tạo payment URL rồi redirect
    if (this.selectedMethod === 'VNPAY') {
      this.processVnPayPayment();
      return;
    }

    // Các phương thức khác: cập nhật trạng thái đơn hàng
    this.processDirectPayment();
  }

  /**
   * Thanh toán qua VNPay: gọi API tạo URL thanh toán, sau đó redirect sang VNPay.
   */
  private processVnPayPayment(): void {
    if (!this.order) return;

    this.isProcessing = true;

    this.vnpayService.createPaymentUrl(this.order.id).subscribe({
      next: (response) => {
        toast.info('Đang chuyển hướng đến VNPay...');
        // Redirect sang cổng thanh toán VNPay
        this.vnpayService.redirectToVnPay(response.paymentUrl);
      },
      error: (err) => {
        console.error('VNPay create payment error:', err);
        toast.error('Không thể tạo thanh toán VNPay. Vui lòng thử lại.');
        this.isProcessing = false;
      }
    });
  }

  /**
   * Thanh toán trực tiếp (tiền mặt, thẻ): cập nhật trạng thái đơn hàng thành PAID.
   */
  private processDirectPayment(): void {
    if (!this.order) return;

    this.isProcessing = true;

    const request: UpdateOrderRequest = {
      orderDate: this.order.orderDate,
      customerId: this.order.customerId || undefined,
      orderOrigin: this.order.orderOrigin,
      price: this.order.price,
      paymentState: 'PAID',
      processState: this.order.processState,
      deliveryService: this.order.deliveryService,
      shopId: this.order.shopId || undefined,
      createdBy: this.order.createdBy || undefined,
      updatedBy: this.order.updatedBy || undefined,
      paymentMethod: this.selectedMethod,
      description: this.order.description
    };

    this.orderService.updateOrder(this.order.id, request).subscribe({
      next: () => {
        toast.success('Thanh toán thành công!');
        this.isProcessing = false;
        this.resetState();
        this.paymentService.close(true);
      },
      error: () => {
        toast.error('Thanh toán thất bại. Vui lòng thử lại.');
        this.isProcessing = false;
      }
    });
  }

  cancel(): void {
    this.resetState();
    this.paymentService.close(false);
  }

  private resetState(): void {
    this.selectedMethod = 'CASH';
    this.cashReceived = 0;
    this.isProcessing = false;
    this.selectedQuickAmount = null;
  }
}









