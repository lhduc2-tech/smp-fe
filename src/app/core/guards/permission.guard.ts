import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredPermissions: string[] =
    route.data?.['permissions'] || [];

  const hasPermission = requiredPermissions.every(p =>
    auth.hasPermission(p)
  );

  if (hasPermission) {
    return true;
  }

  router.navigate(['/403']);
  return false;
};
