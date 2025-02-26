import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleControllerService , Vehicle } from '../../../openapi';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HeaderFrontComponent} from "../../header-front/header-front.component";
import {FooterFrontComponent} from "../../footer-front/footer-front.component";

@Component({
  selector: 'app-vehicle-form-client',
  imports: [
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


  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleControllerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Set default values for status and type
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      capacity: ['', Validators.required],
      licensePlate: ['', Validators.required],
      vin: ['', Validators.required],
      fabricationDate: ['', Validators.required],
      fuelType: ['', Validators.required],
      image: ['', Validators.required],
// Set defaults for fields not shown in the UI:
      //vehicleStatus: ['inServer'], // default value
      vehicleType: ['car']         // default value
    });
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
      const image: Blob = this.selectedFile;
      this.vehicleService.addVehicle(vehicle).subscribe({
        next: (data) => {
          console.log('Vehicle created', data);
          this.router.navigate(['/vehicles']);
        },
        error: (err) => console.error('Error creating vehicle', err)
      });
    } else {
      console.error("Form is invalid or image not selected");
    }
  }

}
