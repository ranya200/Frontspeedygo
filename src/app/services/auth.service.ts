import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private keycloak: KeycloakService) {}

  async init() {
    try {
      await this.keycloak.init({
        config: {
          url: 'http://localhost:8080',
          realm: 'SpeedyGo', // Your Keycloak realm
          clientId: 'speedygo-frontend', // Your client ID
        },
        initOptions: {
          onLoad: 'check-sso', // ✅ Use 'check-sso' instead of 'login-required'
          checkLoginIframe: false,
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        },
        enableBearerInterceptor: true,
      });
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
    }
  }

  getToken(): string {
    return this.keycloak.getKeycloakInstance().token || '';
  }

  logout() {
    this.keycloak.logout();
  }
}
