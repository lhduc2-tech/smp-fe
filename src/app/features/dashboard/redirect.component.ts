import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  standalone: true,
  template: ``
})
export class RedirectComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.auth.hasRole('ADMIN')) {
      this.router.navigate(['/dashboard/owner']);
    } else if (this.auth.hasRole('STAFF')) {
      this.router.navigate(['/dashboard/staff']);
    } else {
      this.router.navigate(['/403']);
    }
  }
}