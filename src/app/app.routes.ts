import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/layout/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
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
        component: DashboardComponent
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
        loadChildren: () => import('./features/staff/staff.module').then(m => m.StaffModule)
      }
    ]
  }
];
