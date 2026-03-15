import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../auth/services/auth.service';
import { Customer, CreateCustomerRequest } from '../models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    private readonly API_ENDPOINT = '/private/api/v1/customer';
    private apiService = inject(ApiService);
    private authService = inject(AuthService);

    /* ================= GET ALL ================= */

    getCustomers(): Observable<Customer[]> {
        const shopId = this.authService.shopId;
        if (!shopId) {
            throw new Error('Shop ID not found');
        }
        return this.apiService.get<any[]>(`${this.API_ENDPOINT}/by-shop/${shopId}`).pipe(
            map(res => res.map(item => this.transformCustomer(item)))
        );
    }

    /* ================= CREATE ================= */

    createCustomer(request: CreateCustomerRequest): Observable<Customer> {
        return this.apiService
            .post<any>(this.API_ENDPOINT, request)
            .pipe(map(res => this.transformCustomer(res)));
    }

    /* ================= TRANSFORM ================= */

    private transformCustomer(res: any): Customer {
        return {
            id: res.id,
            name: res.name ?? res.customer_name ?? res.customerName ?? res.full_name ?? res.fullName,
            phone: res.phone ?? res.phone_number ?? res.phoneNumber,
            email: res.email,
            address: res.address,
            shopId: res.shop_id ?? res.shopId,
            createdAt: res.created_at ?? res.createdAt,
            updatedAt: res.updated_at ?? res.updatedAt,
            createdBy: res.created_by ?? res.createdBy,
            updatedBy: res.updated_by ?? res.updatedBy
        };
    }
}
