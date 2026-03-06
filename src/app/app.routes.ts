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
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/components/profile/profile.component')
            .then(m => m.ProfileComponent)
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./features/order/order.module')
            .then(m => m.OrderModule)
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/product/product.module')
            .then(m => m.ProductModule)
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/category/cate.module')
            .then(m => m.CategoryModule)
      },
      {
        path: 'supplier',
        loadChildren: () =>
          import('./features/supplier/supplier.module')
            .then(m => m.SupplierModule)
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

    ]
  },

  // ======================
  // Fallback
  // ======================
  { path: '**', redirectTo: 'login' }
];
