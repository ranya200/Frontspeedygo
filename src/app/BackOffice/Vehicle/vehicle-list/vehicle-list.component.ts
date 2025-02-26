import { Component, OnInit } from '@angular/core';
import { VehicleControllerService, Vehicle } from '../../../openapi';
import { CommonModule, NgForOf } from '@angular/common';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-vehicle-list',
  imports: [
    CommonModule,
    NgForOf,
    NavbarBackComponent,
    SidebarBackComponent,
    RouterLink,
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
      next:  async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convertir Blob en texte
          this.vehicles = JSON.parse(text); // Convertir en JSON
        } else {
          this.vehicles = response; // Déjà un tableau JSON
        }
        console.log("Données reçues :", this.vehicles);
      },
      error: (err) => console.error('Erreur lors de la récupération des congés', err)
    });
  }


  acceptVehicle(vehicle: Vehicle): void {
    vehicle.vehicleStatus = 'accepted'; // Assuming the backend expects a string like 'accepted'
    this.vehicleService.acceptVehicle(vehicle.idV!).subscribe({
      next: () => {
        alert('Vehicle accepted successfully!');
        this.loadVehicles();
      },
      error: (error) => console.error('Error accepting vehicle', error)
    });
  }

  rejectVehicle(vehicle: Vehicle): void {
    if (confirm('Are you sure you want to reject this vehicle?')) {
      this.vehicleService.rejectVehicle(vehicle.idV!).subscribe({
        next: () => {
          alert('Vehicle rejected successfully!');
          this.loadVehicles();
        },
        error: (error) => console.error('Error rejecting vehicle', error)
      });
    }
  }

}
