import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleControllerService, Vehicle } from '../../../openapi';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarBackComponent } from "../../navbar-back/navbar-back.component";
import { SidebarBackComponent } from "../../sidebar-back/sidebar-back.component";
import { FormsModule } from '@angular/forms';

@Component({
  imports: [
    CommonModule, // ✅ Required for `*ngFor`
    FormsModule, // ✅ Ensure FormsModule is included
    ReactiveFormsModule ,//✅ Required for `formControlName`
    NavbarBackComponent,
    SidebarBackComponent
  ],
  selector: 'app-vehicle-edit',
  standalone: true,
  styleUrls: ['./vehicle-edit.component.css'],
  templateUrl: "./vehicle-edit.component.html"
})
export class VehicleEditComponent implements OnInit {
  vehicleForm!: FormGroup;
  vehicles: any[] = [];
  vehicleId!: string;
  isLoading: boolean = true;
  selectedFile!: File;
  selectedVehicle: any = null;
  vehicleStatuses = ['inServer', 'underRepair', 'outOfService'];
  vehicleStatusD = ['PENDING', 'APPROVED', 'REJECTED'];
  // List of vehicle types
  vehicleTypes = ['car', 'van', 'motoCycle'];

  constructor(
    private vehicleService: VehicleControllerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize the vehicle form
    this.vehicleForm = this.fb.group({
      idV: [''],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      capacity: ['', Validators.required],
      licensePlate: ['', Validators.required],
      vin: ['', Validators.required],
      fabricationDate: [''],
      fuelType: ['', Validators.required],
      imageFileName: [''],  // File input, but handle this carefully
      vehicleStatus: ['', Validators.required],
      vehicleType: ['', Validators.required],
      vehicleStatusD: ['', Validators.required]
    });

    // Get the vehicle ID from the route (e.g., /vehicle/edit/123)
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';

    // Check if vehicleId exists
    if (!this.vehicleId) {
      alert('❌ Vehicle ID not found!');
      this.router.navigate(['/vehicles']); // Redirect if ID is missing
    } else {
      // Load the vehicle details using the vehicle ID
      this.loadVehicle();
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      // Optionally update the form control with the file name
      this.vehicleForm.patchValue({ image: this.selectedFile.name });
    }
  }

  loadVehicle(): void {
    this.vehicleService.getVehicle(this.vehicleId).subscribe({

        next: async (response) => {
          if (response instanceof Blob) {
            const text = await response.text(); // Convert Blob to text
            const vehicle = JSON.parse(text);
            this.vehicleForm.patchValue(vehicle);
          } else {
            this.vehicleForm.patchValue(response);
          }
          console.log('Form Valid After Patch:', this.vehicleForm.valid);
          console.log('Form Values:', this.vehicleForm.value);

        },
      error: (err) => console.error('Error ', err)
    });
  }

  onSubmit(): void {
    console.log('Form Valid:', this.vehicleForm.valid); // Check the validity
    console.log('Form Values:', this.vehicleForm.value); // Log form values
    if (this.vehicleForm.valid) {
      const formValue = this.vehicleForm.value;

      // Prepare the data to send to the API
      const updatedVehicle: Vehicle = {
        brand: formValue.brand,
        model: formValue.model,
        capacity: formValue.capacity,
        licensePlate: formValue.licensePlate,
        vin: formValue.vin,
        fabricationDate: formValue.fabricationDate,
        fuelType: formValue.fuelType,
        vehicleStatus: formValue.vehicleStatus,
        vehicleType: formValue.vehicleType,
        vehicleStatusD: formValue.vehicleStatusD,
      };

      // Add the image file name if a file is selected (if you are only saving the file name, otherwise handle file upload separately)
      if (this.selectedFile) {
        updatedVehicle.imageFileName = this.selectedFile.name;  // Update with the file name or process the file itself
      }

      // Call the service to update the vehicle data
      this.vehicleService.updateVehicle(this.vehicleId, updatedVehicle).subscribe({
        next: (response) => {
          console.log('✅ Vehicle updated successfully:', response);
          alert('Vehicle updated successfully!');
          this.router.navigate(['/vehicles']);  // Redirect to the vehicle list page
        },
        error: (err) => {
          console.error('❌ Error updating vehicle:', err);
          alert('Failed to update vehicle. Please try again.');
        }
      });
    } else {
      console.error('❌ Form is invalid!');
      for (const controlName in this.vehicleForm.controls) {
        if (this.vehicleForm.controls[controlName].invalid) {
          console.log(`${controlName} is invalid`);
        }
      }
      alert('Please fill in all the required fields.');
    }
  }


  onVehicleSelect(vehicleId: string): void {
    // Find the selected vehicle by its ID from the vehicle list
    this.selectedVehicle = this.vehicles.find((vehicle) => vehicle.id === vehicleId);

    if (this.selectedVehicle) {
      // Populate the form with the selected vehicle's details
      this.populateForm(this.selectedVehicle);
    }
  }
  populateForm(vehicleDetails: any): void {
    this.vehicleForm.setValue({
      brand: vehicleDetails.brand,
      model: vehicleDetails.model,
      capacity: vehicleDetails.capacity,
      licensePlate: vehicleDetails.licensePlate,
      vin: vehicleDetails.vin,
      fabricationDate: vehicleDetails.fabricationDate,
      fuelType: vehicleDetails.fuelType,
      vehicleStatus: vehicleDetails.vehicleStatus,
      vehicleType: vehicleDetails.vehicleType,
      vehicleStatusD: vehicleDetails.vehicleStatusD

    });

  }


  cancelEdit(): void {
    this.router.navigate(['/vehicles']); // Navigate back to the list
  }
}
