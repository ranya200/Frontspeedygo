import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleControllerService, Vehicle } from '../../../openapi';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';

@Component({
  selector: 'app-vehicle-form-delivary',
  standalone: true,
  imports:
    [CommonModule, // ✅ Required for `*ngFor`
    FormsModule, // ✅ Ensure FormsModule is included
    ReactiveFormsModule,
    HeaderFrontComponent,
    FooterFrontComponent],
  templateUrl: './vehicle-form-delivary.component.html',
  styleUrls: ['./vehicle-form-delivary.component.css']
})
export class VehicleFormDelivaryComponent implements OnInit {
  vehicleForm!: FormGroup;
  selectedFile!: File;
  vehicleStatuses = ['inServer', 'underRepair', 'outOfService'];

  // List of vehicle types
  vehicleTypes = ['car', 'van', 'motoCycle'];


  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleControllerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Set default values for status and type
    this.vehicleForm = this.fb.group({
      brand: ['',  Validators.required,
        Validators.pattern('^[A-Za-z ]+$'), // Only letters and spaces
        Validators.maxLength(20)],
      model: ['', Validators.required,
        Validators.pattern('^[A-Za-z0-9 ]+$'), // Letters, numbers, and spaces
        Validators.maxLength(20)],
      capacity: ['', Validators.required,
        Validators.pattern('^[0-9]+$'), // Only numbers
        Validators.min(1), // Min value = 1
        Validators.max(9)],
      licensePlate: ['', Validators.required,
        Validators.pattern('^[A-Z0-9-]+$'), // Letters, numbers, and dashes
        Validators.maxLength(10)],
      vin: ['', Validators.required,
        Validators.pattern('^[A-HJ-NPR-Z0-9]{17}$')],
      fabricationDate: ['', Validators.required],
      fuelType: ['', Validators.required,
        Validators.pattern('^[A-Za-z ]+$'), // Only letters and spaces
        Validators.maxLength(15)],
      image: ['', Validators.required],
// Set defaults for fields not shown in the UI:
      vehicleStatus: ['', Validators.required],
      vehicleType: ['', Validators.required],        // default value
      vehicleStatusD: ['PENDING'] // ✅ Ensure this is set by default
    });
    console.log("🚗 Vehicle Statuses:", this.vehicleStatuses);
    console.log("🚙 Vehicle Types:", this.vehicleTypes);

  }
  ngAfterViewInit(): void {
    console.log("🚗 Debugging: Vehicle Statuses in View:", this.vehicleStatuses);
    console.log("🚙 Debugging: Vehicle Types in View:", this.vehicleTypes);
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      // Optionally update the form control with the file name
      this.vehicleForm.patchValue({ image: this.selectedFile.name });
    }
  }

  onSubmit(): void {
    if (this.vehicleForm.valid && this.selectedFile) {
      const vehicle: Vehicle = this.vehicleForm.value;

      // ✅ Check if vehicleStatus and vehicleType are selected
      if (!vehicle.vehicleStatus) {
        alert("⚠️ Please select a vehicle status!");
        return;
      }
      if (!vehicle.vehicleType) {
        alert("⚠️ Please select a vehicle type!");
        return;
      }

      const image: Blob = this.selectedFile;

      this.vehicleService.addVehicle( vehicle , image).subscribe({
        next: (data) => {
          console.log('✅ Vehicle created', data);
          this.router.navigate(['/vehicles']);
        },
        error: (err) => console.error('❌ Error creating vehicle', err)
      });
    } else {
      alert("⚠️ Please fill out all fields and select an image!");
    }
  }
}
