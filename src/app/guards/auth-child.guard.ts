import {inject, Injectable} from '@angular/core';
import {
  CanActivateChildFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authChildGuard: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(`authChildGuard>> authService.isLoggedIn()= ${authService.isLoggedIn()}`);
  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Redirect to the login page
    router.navigate(['/login']);
    return false;
  }
};
