import { Component, OnInit } from '@angular/core';
import { VehicleControllerService, Vehicle } from '../../../openapi';
import { CommonModule, NgForOf } from '@angular/common';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";

@Component({
  selector: 'app-vehicle-list',
  imports: [
    CommonModule,
    NgForOf,
    NavbarBackComponent,
    SidebarBackComponent,
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];

  constructor(private vehicleService: VehicleControllerService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (data: Vehicle[]) => {
        console.log('Vehicles retrieved:', data);
        this.vehicles = data;
      },
      error: (error) => console.error('Error fetching vehicles', error)
    });
  }


  acceptVehicle(vehicle: Vehicle): void {
    alert('Vehicle accepted: ' + vehicle.idV);
  }

  rejectVehicle(vehicle: Vehicle): void {
    alert('Vehicle rejected: ' + vehicle.idV);
  }
}
