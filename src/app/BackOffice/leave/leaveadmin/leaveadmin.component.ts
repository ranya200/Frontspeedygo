import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Leave, LeaveControllerService, LeaveSettings, LeaveSettingsControllerService } from 'src/app/openapi';
import { NavbarBackComponent } from "../../navbar-back/navbar-back.component";
import { SidebarBackComponent } from "../../sidebar-back/sidebar-back.component";
import { FooterBackComponent } from "../../footer-back/footer-back.component";
import { LeaveSettingsComponent } from '../leave-settings/leave-settings.component';
import { LeaveRequestsListComponent } from '../leave-requests-list/leave-requests-list.component';
import { LeaveSummaryComponent } from '../leave-summary/leave-summary.component';

@Component({
  selector: 'app-leaveadmin',
  standalone: true,
  imports: [CommonModule,
    NavbarBackComponent,
    SidebarBackComponent,
    FooterBackComponent,
    LeaveSettingsComponent,
    LeaveRequestsListComponent,
    LeaveSummaryComponent
    ],
  templateUrl: './leaveadmin.component.html',
  styleUrl: './leaveadmin.component.css'
})
export class LeaveadminComponent{

 
}
