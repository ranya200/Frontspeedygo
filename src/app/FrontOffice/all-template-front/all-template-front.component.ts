import { Component } from '@angular/core';
import {HeaderFrontComponent} from "../header-front/header-front.component";
import { FooterFrontComponent} from "../footer-front/footer-front.component";

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-all-template-front',
  templateUrl: './all-template-front.component.html',
  styleUrl: './all-template-front.component.css',

  standalone: true, // ✅ Make it standalone like CarpoolingComponent
  imports: [CommonModule, HeaderFrontComponent, FooterFrontComponent],

})
export class AllTemplateFrontComponent {

}
