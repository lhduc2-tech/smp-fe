import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-forbidden',
  template: `
    <h1>403 - Forbidden</h1>
    <p>Bạn không có quyền truy cập chức năng này.</p>
    <a routerLink="/login">Quay lại đăng nhập</a>
  `
})
export class ForbiddenComponent {}
