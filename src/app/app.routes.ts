import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        canActivate: [permissionGuard],
        data: { permissions: ['user:read'] },
        loadComponent: () =>
          import('./features/user/components/user.component')
            .then(m => m.UserListComponent)
      }
    ]
  }
];
