import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NavbarBackComponent} from "../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../sidebar-back/sidebar-back.component";

@Component({
  selector: 'app-all-template-back',
  templateUrl: './all-template-back.component.html',
  styleUrl: './all-template-back.component.css',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // ✅ Allows using Web Components like iconify-icon
  imports: [
    NavbarBackComponent,
    SidebarBackComponent
  ]
})
export class AllTemplateBackComponent {

}
