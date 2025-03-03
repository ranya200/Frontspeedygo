import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.isLoggedIn = await this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      //this.userProfile = await this.authService.getBackendUser(); // Récupère depuis le backend
      //this.userRoles = this.userProfile ? [this.userProfile.role] : [];
      this.userProfile = await this.authService.getUserProfile();
      //this.userRoles = await this.authService.getUserRoles();
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
