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
          url: 'http://localhost:8085', // URL de ton Keycloak
          realm: 'SpeedyGo',
          clientId: 'speedygo-frontend',
        },
        initOptions: {
          onLoad: 'check-sso', // Vérifie la session sans forcer le login
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          checkLoginIframe: false,
        },
        enableBearerInterceptor: true,
      });

      await this.storeToken(); // ✅ Sauvegarde du token en Local Storage

      const token = this.keycloak.getKeycloakInstance().token;
      console.log('Token récupéré depuis Keycloak :', token);

    } catch (error) {
      console.error('Keycloak initialization failed:', error);
    }
  }

  async login() {
    console.log('Redirecting to Keycloak login...');
    await this.keycloak.login();
  }

  async logout() {
    console.log('Logging out...');
    await this.keycloak.logout('http://localhost:4200'); // Redirection après logout
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.keycloak.isLoggedIn();
  }

  async storeToken() {
    const token = this.keycloak.getKeycloakInstance().token;
    if (token) {
      localStorage.setItem('token', token); // Sauvegarde du token
      console.log('Token enregistré dans Local Storage');
    } else {
      console.warn('Aucun token récupéré');
    }
  }


  getToken(): string | null {
    return this.keycloak.getKeycloakInstance().token || null;
  }


  async getUserProfile() {
    if (!(await this.keycloak.isLoggedIn())) {
      return null;
    }
    const userProfile = await this.keycloak.loadUserProfile();
    return {
      name: userProfile.firstName + ' ' + userProfile.lastName,
      email: userProfile.email,
    };
  }

  async getUserRoles(): Promise<string[]> {
    if (!(await this.keycloak.isLoggedIn())) {
      return [];
    }
    const token = this.keycloak.getKeycloakInstance().tokenParsed;
    return token?.realm_access?.roles || [];
  }
}
