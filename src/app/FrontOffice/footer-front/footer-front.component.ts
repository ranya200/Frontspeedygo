import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-front',
  standalone: true, // ✅ Make it standalone
  imports: [CommonModule],
  templateUrl: './footer-front.component.html',
  styleUrls: ['./footer-front.component.css']
})
export class FooterFrontComponent {

}
