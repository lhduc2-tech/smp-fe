export interface Customer {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    shopId?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface CreateCustomerRequest {
    fullName: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    shopId: string;
    createdBy?: string;
    updatedBy?: string;
}

