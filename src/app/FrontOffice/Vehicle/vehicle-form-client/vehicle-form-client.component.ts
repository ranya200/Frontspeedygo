import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleControllerService , Vehicle } from '../../../openapi';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HeaderFrontComponent} from "../../header-front/header-front.component";
import {FooterFrontComponent} from "../../footer-front/footer-front.component";
import { FormsModule} from '@angular/forms'; // ✅ Ensure these are imported

@Component({
  selector: 'app-vehicle-form-client',
  standalone: true,
  imports: [
    CommonModule, // ✅ Required for `*ngFor`
    FormsModule, // ✅ Ensure FormsModule is included
    ReactiveFormsModule,
    HeaderFrontComponent,
    FooterFrontComponent,
    ReactiveFormsModule
  ],
  templateUrl: './vehicle-form-client.component.html',
  styleUrl: './vehicle-form-client.component.css'
})
export class VehicleFormClientComponent implements OnInit {
  vehicleForm!: FormGroup;
  selectedFile!: File;
  vehicleStatuses = ['inServer', 'underRepair', 'outOfService'];

  // List of vehicle types
  vehicleTypes = ['car', 'van', 'motoCycle'];
  today: string = new Date().toISOString().split('T')[0];


  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleControllerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Set default values for status and type
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required,
        Validators.pattern('^[A-Za-z ]+$'), // Only letters and spaces
        Validators.maxLength(20)],
      model: ['', Validators.required,
        Validators.pattern('^[A-Za-z0-9 ]+$'), // Letters, numbers, and spaces
        Validators.maxLength(20)],
      capacity: ['', Validators.required,
        Validators.pattern('^[0-9]+$'), // Only numbers
        Validators.min(1), // Min value = 1
        Validators.max(9)],
      licensePlate: ['',  Validators.required,
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
      const formData = new FormData();

      // ✅ Convert vehicle object to JSON string
      const vehicleData = {
        idV: this.vehicleForm.value.idV || null,
        brand: this.vehicleForm.value.brand,
        model: this.vehicleForm.value.model,
        capacity: this.vehicleForm.value.capacity,
        licensePlate: this.vehicleForm.value.licensePlate,
        vin: this.vehicleForm.value.vin,
        fabricationDate: this.vehicleForm.value.fabricationDate,
        fuelType: this.vehicleForm.value.fuelType,
        vehicleStatus: this.vehicleForm.value.vehicleStatus,
        vehicleStatusD: this.vehicleForm.value.vehicleStatusD,
        vehicleType: this.vehicleForm.value.vehicleType,
        adminName: null // Will be assigned in backend
      };

      formData.append('vehicle', JSON.stringify(vehicleData)); // ✅ Send vehicle JSON
      formData.append('imageFileName', this.selectedFile, this.selectedFile.name); // ✅ Send Image

      // @ts-ignore
      this.vehicleService.addVehicle(formData).subscribe({
        next: (data) => {
          console.log('✅ Vehicle created', data);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('❌ Error creating vehicle', err);
          alert("⚠️ Failed to create vehicle: " + err.message);
        }
      });
    } else {
      alert("⚠️ Please fill out all required fields and select an image!");
    }
  }


}
