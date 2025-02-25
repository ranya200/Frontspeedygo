import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private keycloak: KeycloakService) {}

  async init() {
    try {
      console.log('Initializing Keycloak...');
      await this.keycloak.init({
        config: {
          url: 'http://localhost:8085', // Keycloak server URL

          realm: 'SpeedyGo', // Replace with your realm name
          clientId: 'speedygo-frontend', // Replace with your client ID
        },
        initOptions: {
          onLoad: 'login-required', // ✅ Force login
          checkLoginIframe: false,
        },
        enableBearerInterceptor: true,
      });

      console.log('Keycloak initialized successfully');
    } catch (error) {
      console.error('Keycloak initialization failed:', error);
    }
  }

  async isLoggedIn(): Promise<boolean> {
    return this.keycloak.isLoggedIn();
  }

  getToken(): string | null {
    return this.keycloak.getKeycloakInstance().token || null;
  }

  async login() {
    console.log('Redirecting to Keycloak login...');
    await this.keycloak.login();
  }

  logout() {
    console.log('Logging out...');
    this.keycloak.logout();
  }
}
