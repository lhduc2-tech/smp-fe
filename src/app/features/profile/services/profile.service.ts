import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    phone_number: string;
    status: string;
    full_name: string;
    roles: string[];
}

export interface UpdateProfileRequest {
    full_name: string;
    email: string;
    phone_number: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private apiUrl = `${environment.api.baseUrl}${environment.api.contextPath}/private/api/v1/users/me`;

    constructor(private http: HttpClient) { }

    getProfile(): Observable<UserProfile> {
        return this.http.get<UserProfile>(this.apiUrl);
    }

    updateProfile(request: UpdateProfileRequest): Observable<UserProfile> {
        return this.http.put<UserProfile>(this.apiUrl, request);
    }

    changePassword(request: ChangePasswordRequest): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/password`, request);
    }
}
