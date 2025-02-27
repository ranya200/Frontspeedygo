import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleControllerService, Vehicle } from '../../../openapi';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarBackComponent } from "../../navbar-back/navbar-back.component";
import { SidebarBackComponent } from "../../sidebar-back/sidebar-back.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  standalone: true,
  imports: [
    CommonModule, // ✅ Required for `*ngFor`
    FormsModule, // ✅ Ensure FormsModule is included
    ReactiveFormsModule, //✅ Required for `formControlName`
    NavbarBackComponent,
    SidebarBackComponent
  ],
  styleUrls: ['./vehicle-edit.component.css']
})
export class VehicleEditComponent implements OnInit {
  vehicleForm!: FormGroup;
  vehicleId!: string;
  isLoading: boolean = true;
  selectedFile!: File;
  vehicleStatuses = ['inServer', 'underRepair', 'outOfService'];

  // List of vehicle types
  vehicleTypes = ['car', 'van', 'motoCycle'];

  constructor(
    private vehicleService: VehicleControllerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // ✅ Get the vehicle ID from the route
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.vehicleId) {
      alert('❌ Vehicle ID not found!');
      this.router.navigate(['/vehicles']); // ✅ Redirect if ID is missing
    } else {
      this.loadVehicle();
    }

    // ✅ Initialize the form with empty values
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      capacity: ['', Validators.required],
      licensePlate: ['', Validators.required],
      vehicleType: ['', Validators.required],
      fuelType: ['', Validators.required],
      fabricationDate: ['', Validators.required],
      vehicleStatusD: ['PENDING'] ,
      vehicleStatus: ['', Validators.required]

    });

  }

  loadVehicle(): void {
    if (this.vehicleId) {
      this.vehicleService.getVehicle(this.vehicleId).subscribe({
        next: (vehicle: Vehicle) => {
          console.log('✅ Vehicle loaded:', vehicle);
          this.vehicleForm.patchValue(vehicle); // ✅ Populate the form with vehicle details
          this.isLoading = false;
        },
        error: (err) => {
          console.error('❌ Error loading vehicle:', err);
          this.isLoading = false;
        }
      });
    }
  }

  updateVehicle(): void {
    if (this.vehicleForm.valid) {
      // ✅ Ensure the vehicle ID is included in the update request
      const updatedVehicle: Vehicle = { ...this.vehicleForm.value, idV: this.vehicleId };

      this.vehicleService.removeVehicle(this.vehicleId).subscribe({
        next: () => {
          alert('✅ Vehicle updated successfully!');
          this.router.navigate(['/vehicles']);
        },
        error: (err) => {
          console.error('❌ Error updating vehicle:', err);
        }
      });
    } else {
      alert('⚠️ Please fill in all required fields!');
    }
  }

  deleteVehicle(): void {
    if (confirm('⚠️ Are you sure you want to delete this vehicle?')) {
      this.vehicleService.removeVehicle(this.vehicleId).subscribe({
        next: () => {
          alert('✅ Vehicle deleted successfully!');
          this.router.navigate(['/vehicles']);
        },
        error: (err) => {
          console.error('❌ Error deleting vehicle:', err);
        }
      });
    }
  }
}
