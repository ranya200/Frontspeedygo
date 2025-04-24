import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Maintenance, MaintenanceControllerService } from "../../../openapi";
import { ActivatedRoute, Router } from "@angular/router";
import { NavbarBackComponent } from "../../navbar-back/navbar-back.component";
import { SidebarBackComponent } from "../../sidebar-back/sidebar-back.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarBackComponent,
    SidebarBackComponent
  ],
  templateUrl: './maintenance-schedule.component.html',
  styleUrls: ['./maintenance-schedule.component.css']
})
export class MaintenanceScheduleComponent implements OnInit {
  scheduleForm!: FormGroup;
  vehicleIdFromRoute!: string;

  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenanceControllerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vehicleIdFromRoute = this.route.snapshot.paramMap.get('vehicleId') || '';
    this.scheduleForm = this.fb.group({
      description: ['', [
        Validators.required,
        Validators.pattern('^[A-Za-z ]+$'),
        Validators.maxLength(20)
      ]],
      triggerDistanceKm: [0, Validators.required],
      currentDistanceKm: [0, Validators.required],
      vehicleId: [this.vehicleIdFromRoute, Validators.required],
      completed: [false]
    });
  }

  submit(): void {
    const maintenance: Maintenance = this.scheduleForm.value;
    this.maintenanceService.scheduleMaintenance(maintenance).subscribe({
      next: () => {
        alert('✅ Maintenance planifiée avec succès');
        this.router.navigate(['/maintenance']);
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
}
