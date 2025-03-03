import { Component, OnInit } from '@angular/core';
import { VehicleControllerService, Vehicle } from '../../../openapi';
import { CommonModule, NgForOf } from '@angular/common';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormsModule} from "@angular/forms";

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarBackComponent,
    SidebarBackComponent,
    FormsModule
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  errorMessage: string = '';
  searchTerm: string = '';

  constructor(private fb: FormBuilder, private vehicleService: VehicleControllerService, private router: Router) {
  }

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

  approveVehicle(vehicule: Vehicle): void {
    if (confirm("whould you accept this vehicule add  ?")) {
      this.vehicleService.approveVehicle(vehicule.idV!).subscribe({
        next: () => {
          alert("The add is accepted !");
          this.loadVehicles(); // Refresh the list
        },
        error: (err) => console.error("Error", err)
      });
    }
  }

  rejectVehicle(vehicule: Vehicle): void {
    if (confirm("whould you reject this vehicule add?")) {
      this.vehicleService.rejectVehicle(vehicule.idV!).subscribe({
        next: () => {
          alert("The add is rejected !");
          this.loadVehicles(); // Refresh the list
        },
        error: (err) => console.error("Error", err)
      });
    }
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

  editProduct(id: string): void {
    // Redirection vers le composant d'édition
    this.router.navigate(['/edit-vehicle', id]);
  }

  search() {
    console.log("Search button clicked! Searching for:", this.searchTerm);

    if (this.searchTerm.trim()) {
      this.vehicleService.searchVehicles(this.searchTerm).subscribe(
        (data: any) => {
          console.log("Received data type:", typeof data);

          if (data instanceof Blob) {
            console.error("❌ ERROR: Received Blob instead of JSON! Backend issue.");
            return;
          }

          console.log("✅ Vehicles received:", data);
          this.vehicles = data; // Store received vehicles
        },
        error => {
          console.error("❌ API Error:", error);
        }
      );
    }
  }



}


