import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [

  // Root → login
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },

  // Public
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/components/register/register.component')
        .then(m => m.RegisterComponent)
  },
  {
    path: '403',
    loadComponent: () =>
      import('./shared/components/forbidden/forbidden.component')
        .then(m => m.ForbiddenComponent)
  },

  // Protected
  {
    path: 'users',
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['user:read'] },
    loadComponent: () =>
      import('./features/user/components/user.component')
        .then(m => m.UserListComponent)
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];
