import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const permissions: string[] = route.data?.['permissions'] ?? [];

  const hasPermission = permissions.every(p =>
    auth.hasPermission(p)
  );

  return hasPermission ? true : router.createUrlTree(['/403']);
};