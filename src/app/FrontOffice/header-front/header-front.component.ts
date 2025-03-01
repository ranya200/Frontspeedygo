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
    this.isLoggedIn = await this.authService.isLoggedIn(); // Vérifier si l'utilisateur est connecté

    if (this.isLoggedIn) {
      this.userProfile = await this.authService.getUserProfile();
      this.userRoles = await this.authService.getUserRoles();
    }
  }

  logout() {
    this.authService.logout();
  }
  login() {
    this.authService.login();
  }
}
