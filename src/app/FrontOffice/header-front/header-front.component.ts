import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-header-front',
  standalone: true, // ✅ Make it standalone
  imports: [CommonModule],
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css']
})
export class HeaderFrontComponent {
  userProfile: any = null;
  userRoles: string[] = [];
  isLoggedIn: boolean = false; // Variable pour gérer l'affichage des icônes

  constructor(private authService: AuthService, private http: HttpClient) {}

  async ngOnInit() {
    this.isLoggedIn = await this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.authService.getUserProfile();

      // 🔹 Récupère l'utilisateur depuis le backend
      this.http.get<any>('http://localhost:8089/speedygo/api/user/me', {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      }).subscribe({
        next: (data: any) => {
          console.log('✅ Utilisateur chargé:', data);
        },
        error: (err: any) => {
          console.error('❌ Erreur de récupération utilisateur:', err);
        }
      });

    }
  }


  logout() {
    this.authService.logout();
  }
  login() {
    this.authService.login();
  }
  // 🔹 Redirige vers l'interface de modification du profil Keycloak
  editProfile() {
    const keycloakUrl = 'http://localhost:8085/realms/SpeedyGo/account';
    const redirectUri = encodeURIComponent('http://localhost:4200'); // Redirection vers l'application
    window.location.href = `${keycloakUrl}?referrer=speedygo-frontend&referrer_uri=${redirectUri}`;
  }


}
