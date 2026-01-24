import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  SocialAuthService,
  GoogleLoginProvider
} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private socialAuth: SocialAuthService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  // ===== LOGIN BẰNG USERNAME / PASSWORD =====
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { username, password } = this.form.value;

    this.authService.login({ username, password }).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.loading = false;
      }
    });
  }

  // ===== LOGIN BẰNG GOOGLE =====
  loginWithGoogle(): void {
  this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then(user => {

      // ✅ GUARD CLAUSE – BẮT BUỘC
      const idToken = user.idToken;
      if (!idToken) {
        console.error('Google ID token is missing');
        return;
      }

      this.authService.loginWithGoogle(idToken).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err: unknown) => {
          console.error('Google login failed', err);
        }
      });
    })
    .catch((err: unknown) => {
      console.error('Google sign-in error', err);
    });
}
}
