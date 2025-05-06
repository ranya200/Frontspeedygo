import {Component, OnInit} from '@angular/core';
import {Maintenance, MaintenanceControllerService, Vehicle} from "../../../openapi";
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";
import {NgForOf, NgIf} from "@angular/common";



@Component({
  selector: 'app-vehicle-alert',
  standalone: true,
  imports: [
    NavbarBackComponent,
    SidebarBackComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './vehicle-alert.component.html',
  styleUrl: './vehicle-alert.component.css'
})
export class VehicleAlertComponent implements OnInit {
  vehicles: Vehicle[] = [];

  constructor(private maintenanceService: MaintenanceControllerService) {}

  ngOnInit(): void {
    this.loadCriticalMaintenanceVehicles();
  }

  loadCriticalMaintenanceVehicles(): void {
    this.maintenanceService.getVehiclesThatNeedMaintenanceSoon().subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text();
          this.vehicles = JSON.parse(text);
        } else {
          this.vehicles = response;
        }
        console.log("🚨 Vehicles near maintenance deadline:", this.vehicles);
      },
      error: (err) => console.error("❌ Error loading alerts:", err)
    });
  }
}
