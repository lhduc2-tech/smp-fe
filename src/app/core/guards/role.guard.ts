import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const roles: string[] = route.data?.['roles'] ?? [];

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const hasRole = roles.some(r => auth.hasRole(r));

  return hasRole ? true : router.createUrlTree(['/403']);
};