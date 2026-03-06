import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { Customer } from '../models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    private readonly API_ENDPOINT = '/private/api/v1/customer';
    private apiService = inject(ApiService);

    /* ================= GET ALL ================= */

    getCustomers(): Observable<Customer[]> {
        return this.apiService.get<any[]>(this.API_ENDPOINT).pipe(
            map(res => res.map(item => this.transformCustomer(item)))
        );
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
