import { Routes } from '@angular/router';

// Layout & pages
import { AdminLayoutComponent } from './shared/layout/admin-layout.component';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
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

    // redirect root → dashboard
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    },

    // 🔥 redirect dashboard theo role
    {
      path: 'dashboard',
      loadComponent: () =>
        import('./features/dashboard/redirect.component')
          .then(m => m.RedirectComponent)
    },

    // 👑 ADMIN dashboard
    {
      path: 'dashboard/owner',
      canActivate: [roleGuard],
      data: { roles: ['ADMIN'] },
      loadComponent: () =>
        import('./features/dashboard/dashboard.module')
          .then(m => m.OwnerDashboardComponent)
    },

    // 👨‍💼 STAFF dashboard
    {
      path: 'dashboard/staff',
      canActivate: [roleGuard],
      data: { roles: ['STAFF', 'CASHIER', 'WAREHOUSE'] },
      loadComponent: () =>
        import('./features/dashboard/dashboard.module')
          .then(m => m.StaffDashboardComponent)
    },

    {
      path: 'profile',
      loadComponent: () =>
        import('./features/profile/components/profile/profile.component')
          .then(m => m.ProfileComponent)
    },

    // ======================
    // BUSINESS MODULES
    // ======================

    {
      path: 'orders',
      canActivate: [permissionGuard],
      data: { permissions: ['order:read'] },
      loadChildren: () =>
        import('./features/order/order.module')
          .then(m => m.OrderModule)
    },

    {
      path: 'products',
      canActivate: [permissionGuard],
      data: { permissions: ['product:read'] },
      loadChildren: () =>
        import('./features/product/product.module')
          .then(m => m.ProductModule)
    },

    {
      path: 'categories',
      canActivate: [permissionGuard],
      data: { permissions: ['category:read'] },
      loadChildren: () =>
        import('./features/category/cate.module')
          .then(m => m.CategoryModule)
    },

    {
      path: 'supplier',
      canActivate: [permissionGuard],
      data: { permissions: ['supplier:read'] },
      loadChildren: () =>
        import('./features/supplier/supplier.module')
          .then(m => m.SupplierModule)
    },

    {
      path: 'inventory',
      canActivate: [permissionGuard],
      data: { permissions: ['inventory:read'] },
      loadChildren: () =>
        import('./features/warehouse/inventory-flow.module')
          .then(m => m.InventoryFlowModule)
    },

    {
      path: 'customers',
      canActivate: [permissionGuard],
      data: { permissions: ['customer:read'] },
      loadChildren: () =>
        import('./features/customer/customer.module')
          .then(m => m.CustomerModule)
    },

    // ======================
    // ADMIN ONLY
    // ======================

    {
      path: 'settings/staff',
      canActivate: [roleGuard, permissionGuard],
      data: {
        roles: ['ADMIN'],
        permissions: ['staff:read']
      },
      loadChildren: () =>
        import('./features/staff/staff.module')
          .then(m => m.StaffModule)
    },

    {
      path: 'settings/role',
      canActivate: [roleGuard, permissionGuard],
      data: {
        roles: ['ADMIN'],
        permissions: ['role:read']
      },
      loadChildren: () =>
        import('./features/role/role.module')
          .then(m => m.RoleModule)
    }

  ]
},
  // ======================
  // Fallback
  // ======================
  { path: '**', redirectTo: 'login' }
];
