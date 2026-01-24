import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const permissions: string[] = route.data?.['permissions'] ?? [];

  return permissions.every(p => auth.hasPermission(p))
    ? true
    : router.createUrlTree(['/403']);
};
