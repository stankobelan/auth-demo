import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log(`authGuard >> authService.isLoggedIn()= ${authService.isLoggedIn()}`);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Redirect to the login page
    router.navigate(['/auth']);
    return false;
  }
};
