import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to the login page with a return url
  return router.createUrlTree(['/login'], { 
    queryParams: { returnUrl: state.url }
  });
};

export const supervisorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getCurrentUser()?.role === 'Supervisor') {
    return true;
  }

  // Redirect to dashboard if logged in but not a supervisor
  if (authService.isLoggedIn()) {
    return router.createUrlTree(['/dashboard']);
  }

  // Redirect to login if not logged in
  return router.createUrlTree(['/login'], { 
    queryParams: { returnUrl: state.url }
  });
};