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
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
