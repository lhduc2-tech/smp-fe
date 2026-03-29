import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';

export interface VnPayCreateResponse {
  paymentUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class VnpayPaymentService {

  private readonly API_ENDPOINT = '/private/api/v1/payment/vnpay/create';

  private apiService = inject(ApiService);

  /**
   * Gọi backend tạo URL thanh toán VNPay.
   * Backend trả về { payment_url: "https://sandbox.vnpayment.vn/..." }
   * (snake_case vì Jackson config)
   */
  createPaymentUrl(orderId: string): Observable<VnPayCreateResponse> {
    return this.apiService.postWithParams<any>(
      this.API_ENDPOINT,
      { orderId }
    ).pipe(
      map((res: any) => ({
        paymentUrl: res.payment_url ?? res.paymentUrl ?? res.url ?? ''
      }))
    );
  }

  /**
   * Redirect user sang cổng thanh toán VNPay.
   */
  redirectToVnPay(paymentUrl: string): void {
    if (!paymentUrl) {
      console.error('VNPay payment URL is empty!');
      return;
    }
    console.log('Redirecting to VNPay:', paymentUrl);
    window.location.href = paymentUrl;
  }
}

