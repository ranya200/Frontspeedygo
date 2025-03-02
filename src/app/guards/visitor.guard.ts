import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateFn } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export const visitorGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);
  const isAuthenticated = await keycloak.isLoggedIn();

  console.log('Visitor Guard: User is authenticated?', isAuthenticated);

  return !isAuthenticated ? true : router.parseUrl('/');
};
