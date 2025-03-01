import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private keycloak: KeycloakService, private router: Router) {}

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

  async logout() {
    try {
      console.log('Déconnexion en cours...');
      await this.keycloak.logout('http://localhost:4200'); // Redirige après logout
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }
}
