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
      next: async (response) => {
        try {
          if (response instanceof Blob) {
            const text = await response.text();
            this.vehicles = JSON.parse(text);
          } else {
            this.vehicles = response;
          }
          console.log("🚗 Vehicles Loaded:", this.vehicles); // Debugging API Response
        } catch (error) {
          console.error("❌ Error parsing vehicle data:", error);
        }
      },
      error: (err) => console.error("❌ Error fetching vehicles:", err),
    });
  }



  //acceptVehicle(vehicle: Vehicle): void {
    ///vehicle.vehicleStatus = 'accepted'; // Assuming the backend expects a string like 'accepted'
    //this.vehicleService.acceptVehicle(vehicle.idV!).subscribe({
     // next: () => {
     //   alert('Vehicle accepted successfully!');
      //  this.loadVehicles();
     // },
      //error: (error) => console.error('Error accepting vehicle', error)
    //});
  //}

  //rejectVehicle(vehicle: Vehicle): void {
  //  if (confirm('Are you sure you want to reject this vehicle?')) {
    //  this.vehicleService.rejectVehicle(vehicle.idV!).subscribe({
      //  next: () => {
        //  alert('Vehicle rejected successfully!');
      //    this.loadVehicles();
    //    },
      //  error: (error) => console.error('Error rejecting vehicle', error)
//});
  //  }
  //}

  /**
   * Update the approval status of a vehicle
   * @param vehicleId - ID of the vehicle
   * @param approved - true = Approve, false = Reject
   */
  updateStatus(vehicleId: string | undefined, approved: boolean): void {
    if (typeof vehicleId === "string") {
      this.vehicleService.updateVehicleStatus(vehicleId, approved).subscribe({
        next: () => {
          const index = this.vehicles.findIndex(v => v.idV === vehicleId);
          if (index !== -1) {
            this.vehicles[index].vehicleStatusD = approved ? 'APPROVED' : 'REJECTED';
          }
          console.log(`✅ Vehicle ${vehicleId} status updated to ${approved ? 'APPROVED' : 'REJECTED'}`);
        },
        error: (err) => console.error("❌ Error updating vehicle status:", err),
      });
    }
  }

  /**
   * Delete a vehicle
   * @param vehicleId - ID of the vehicle to delete
   */
  deleteVehicle(vehicleId: string | undefined): void {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      if (typeof vehicleId === "string") {
        this.vehicleService.removeVehicle(vehicleId).subscribe({
          next: () => {
            this.vehicles = this.vehicles.filter(v => v.idV !== vehicleId);
            console.log(`🗑️ Vehicle ${vehicleId} deleted successfully.`);
          },
          error: (err) => console.error("❌ Error deleting vehicle:", err),
        });
      }
    }
  }

}
