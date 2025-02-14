import { Component, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] ,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent {

}
