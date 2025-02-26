import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleControllerService, Vehicle } from '../../../openapi';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  imports: [
    NavbarBackComponent,
    SidebarBackComponent,
    ReactiveFormsModule
  ],
  styleUrls: ['./vehicle-edit.component.css']
})
export class VehicleEditComponent implements OnInit {
  vehicleForm: FormGroup;
  vehicleId?: string | null;
  vehicle: Vehicle | undefined;

  constructor(
    private vehicleService: VehicleControllerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      capacity: ['', Validators.required],
      licensePlate: ['', Validators.required],
      vehicleType: ['', Validators.required],
      fuelType: ['', Validators.required],
      fabricationDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Safely get the vehicleId from the route
    this.vehicleId = this.route.snapshot.paramMap.get('id');
    if (!this.vehicleId) {
      alert('Vehicle ID not found!');
      this.router.navigate(['/vehicle-list']); // Navigate to the list if ID is not present
    } else {
      this.loadVehicle();
    }
  }

  loadVehicle(): void {
    if (this.vehicleId) {
      this.vehicleService.getVehicle(this.vehicleId).subscribe({
        next: (vehicle) => {
          this.vehicle = vehicle;
          this.vehicleForm.patchValue(vehicle);
        },
        error: (err) => {
          console.error('Error loading vehicle', err);
        }
      });
    }
  }

  updateVehicle(): void {
    if (this.vehicleForm.valid) {
      // Ensure that the vehicleId is set properly before sending the update request
      const updatedVehicle: Vehicle = { ...this.vehicleForm.value, idV: this.vehicleId };

      this.vehicleService.modifyVehicle(updatedVehicle).subscribe({
        next: () => {
          alert('Vehicle updated successfully!');
          this.router.navigate(['/vehicle-list']);
        },
        error: (err) => {
          console.error('Error updating vehicle', err);
        }
      });
    } else {
      alert('Please fill in all the required fields!');
    }
  }

  deleteVehicle(): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      if (this.vehicleId != null) {
        this.vehicleService.removeVehicle(this.vehicleId).subscribe({
          next: () => {
            alert('Vehicle deleted successfully!');
            this.router.navigate(['/vehicle-list']);
          },
          error: (err) => {
            console.error('Error deleting vehicle', err);
          }
        });
      }
    }
  }
}
