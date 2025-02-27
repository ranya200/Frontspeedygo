import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-front',
  standalone: true, // ✅ Make it standalone
  imports: [CommonModule],
  templateUrl: './header-front.component.html',


  styleUrls: ['./header-front.component.css']



})
export class HeaderFrontComponent {

}
