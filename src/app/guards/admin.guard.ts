import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateFn } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export const adminGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);
  const isAuthenticated = await keycloak.isLoggedIn();
  const userRoles = keycloak.getKeycloakInstance().realmAccess?.roles || [];

  console.log('Admin Guard: User roles:', userRoles);

  return isAuthenticated && userRoles.includes('ADMIN') ? true : router.parseUrl('/');
};
