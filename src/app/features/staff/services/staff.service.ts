import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Staff } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private staffList = new BehaviorSubject<Staff[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      position: 'Quản lý cửa hàng',
      status: 'active',
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      phone: '0912345678',
      position: 'Nhân viên bán hàng',
      status: 'active',
      joinDate: '2023-03-20'
    },
    {
      id: '3',
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      phone: '0923456789',
      position: 'Kế toán',
      status: 'active',
      joinDate: '2023-02-10'
    }
  ]);

  getStaffList(): Observable<Staff[]> {
    return this.staffList.asObservable();
  }

  addStaff(staff: Staff): void {
    const currentList = this.staffList.value;
    staff.id = Date.now().toString();
    this.staffList.next([...currentList, staff]);
  }

  updateStaff(staff: Staff): void {
    const currentList = this.staffList.value;
    const index = currentList.findIndex(s => s.id === staff.id);
    if (index > -1) {
      currentList[index] = staff;
      this.staffList.next([...currentList]);
    }
  }

  deleteStaff(id: string): void {
    const currentList = this.staffList.value;
    this.staffList.next(currentList.filter(s => s.id !== id));
  }

  getStaffById(id: string): Observable<Staff | undefined> {
    return new Observable(observer => {
      const staff = this.staffList.value.find(s => s.id === id);
      observer.next(staff);
      observer.complete();
    });
  }
}
