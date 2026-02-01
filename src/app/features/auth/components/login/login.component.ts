import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { GoogleAuthService } from '../../services/google-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // ✅ KHÔI PHỤC CSS
})
export class LoginComponent implements AfterViewInit {

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private googleAuth: GoogleAuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async ngAfterViewInit(): Promise<void> {
    // Nếu đã login → redirect
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // ✅ ĐỢI GOOGLE SDK LOAD + INIT
    await this.googleAuth.initialize((idToken: string) => {
      this.authService.loginWithGoogle(idToken).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: err => console.error('Google login failed', err)
      });
    });

    // ✅ SAU KHI SDK SẴN SÀNG → RENDER BUTTON
    this.googleAuth.renderButton('google-login-btn');
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const { username, password } = this.form.value;

    this.authService.login({ username, password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
