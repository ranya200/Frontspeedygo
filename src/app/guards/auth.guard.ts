import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private keycloak: KeycloakService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const isAuthenticated = await this.keycloak.isLoggedIn();
    return isAuthenticated ? true : this.router.parseUrl('/login');
  }
}
