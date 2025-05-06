import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import * as jwtDecode from 'jwt-decode'; // ✅ works with CommonJS



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //private apiUrl = 'http://localhost:8089/api/user/me'; // URL backend

  constructor(private keycloak: KeycloakService, private router: Router, private http: HttpClient) {}

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
      localStorage.setItem('token', token);
      console.log('✅ Token enregistré dans Local Storage');

      // 🔹 Assure-toi que la requête envoie bien le token
      this.http.get('http://localhost:8089/speedygo/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe({
        next: (data) => console.log('✅ Utilisateur récupéré:', data),
        error: (err) => console.error('❌ Erreur lors de l’enregistrement utilisateur:', err)
      });
    }
  }




  getToken(): string | null {
    return localStorage.getItem('token');
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


  
  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payloadBase64 = token.split('.')[1]; // take the payload part
      const payload = JSON.parse(atob(payloadBase64));
      return payload.sub; // ✅ Keycloak User ID
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  

  getUserNameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payloadBase64 = token.split('.')[1]; // take the payload part
      const payload = JSON.parse(atob(payloadBase64));
      return payload.preferred_username || null; // ✅ Keycloak Username field
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
 
  
}
