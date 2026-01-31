import { Routes } from '@angular/router';

// Layout & pages
import { AdminLayoutComponent } from './shared/layout/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [

  // ======================
  // Public (NO AUTH)
  // ======================
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

  // ======================
  // Protected Admin Layout
  // ======================
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'orders',
        component: DashboardComponent
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/product/product.module')
            .then(m => m.ProductModule)
      },
      {
        path: 'inventory',
        component: DashboardComponent
      },
      {
        path: 'customers',
        component: DashboardComponent
      },
      {
        path: 'reports',
        component: DashboardComponent
      },
      {
        path: 'settings/staff',
        loadChildren: () =>
          import('./features/staff/staff.module')
            .then(m => m.StaffModule)
      },

      // Example: users with permission
      {
        path: 'users',
        canActivate: [permissionGuard],
        data: { permissions: ['user:read'] },
        loadComponent: () =>
          import('./features/user/components/user.component')
            .then(m => m.UserListComponent)
      }
    ]
  },

  // ======================
  // Fallback
  // ======================
  { path: '**', redirectTo: 'login' }
];
