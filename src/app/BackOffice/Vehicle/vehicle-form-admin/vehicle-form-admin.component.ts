import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleControllerService, Vehicle } from '../../../openapi';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";
import { FormsModule} from '@angular/forms'; // ✅ Ensure these are imported
import { CustomVehicleService } from 'src/app/services/custom-vehicle/custom-vehicle.service';


@Component({
  selector: 'app-vehicle-form-admin',
  standalone: true,
  imports: [
    CommonModule, // ✅ Required for `*ngFor`
    FormsModule, // ✅ Ensure FormsModule is included
    ReactiveFormsModule,
    NavbarBackComponent,
    SidebarBackComponent,
    ReactiveFormsModule
  ],
  templateUrl: './vehicle-form-admin.component.html',
  styleUrls: ['./vehicle-form-admin.component.css']
})
export class VehicleFormAdminComponent implements OnInit {
  vehicleForm!: FormGroup;
  selectedFile!: File;
  vehicleStatuses = ['inServer', 'underRepair', 'outOfService'];

  // List of vehicle types
  vehicleTypes = ['car', 'van', 'motoCycle'];
  vehicleStatusD = ['PENDING', 'APPROVED', 'REJECTED'];


  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleControllerService,
    private customVehicleService: CustomVehicleService,
    private router: Router

  ) { }

  ngOnInit(): void {
    // Set default values for status and type
    this.vehicleForm = this.fb.group({
      brand: ['',  [
        Validators.required,
        Validators.pattern('^[A-Za-z ]+$'), // Only letters and spaces
        Validators.maxLength(20)
      ]],
      model: ['', [
        Validators.required,
        Validators.pattern('^[A-Za-z0-9 ]+$'), // Letters, numbers, and spaces
        Validators.maxLength(20)
      ]],
      capacity: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$'), // Only numbers
        Validators.min(1),
        Validators.max(9)
      ]],
      licensePlate: ['', [
        Validators.required,
        Validators.pattern('^[A-Z0-9-]+$'), // Uppercase letters, numbers, and dashes
        Validators.maxLength(10)
      ]],
      vin: ['', [
        Validators.required,
        Validators.pattern('^[A-Za-z0-9 ]+$') // Standard 17-character VIN format
      ]],
      fabricationDate: ['', Validators.required],
      fuelType: ['', [
        Validators.required,
        Validators.pattern('^[A-Za-z ]+$'), // Only letters and spaces
        Validators.maxLength(15)
      ]],
      image: ['', Validators.required],
// Set defaults for fields not shown in the UI:
      vehicleStatus: ['', Validators.required],
      vehicleType: ['', Validators.required],        // default value
      vehicleStatusD: ['', Validators.required] // ✅ Ensure this is set by default
    });
    console.log("🚗 Vehicle Statuses:", this.vehicleStatuses);
    console.log("🚙 Vehicle Types:", this.vehicleTypes);
    console.log("🚙 Vehicle Status:", this.vehicleStatusD);

  }
  ngAfterViewInit(): void {
    console.log("🚗 Debugging: Vehicle Statuses in View:", this.vehicleStatuses);
    console.log("🚙 Debugging: Vehicle Types in View:", this.vehicleTypes);
    console.log("🚙 Debugging: Vehicle Status:", this.vehicleStatusD);
  }
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      // Met à jour le contrôle "image" avec le nom du fichier
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(this.selectedFile.type)) {
        alert('❌ Only PNG, JPEG, or JPG files are allowed!');
        this.vehicleForm.patchValue({ image: '' });
        return;
      }
      this.vehicleForm.patchValue({ image: this.selectedFile.name });
    }
  }

  onSubmit(): void {
    if (this.vehicleForm.valid && this.selectedFile) {
      const formValue = this.vehicleForm.value;

      const vehicle = {
        brand: formValue.brand,
        model: formValue.model,
        capacity: formValue.capacity,
        licensePlate: formValue.licensePlate,
        vin: formValue.vin,
        fabricationDate: new Date(formValue.fabricationDate).toISOString(),
        fuelType: formValue.fuelType,
        vehicleStatus: formValue.vehicleStatus,
        vehicleStatusD: formValue.vehicleStatusD,
        vehicleType: formValue.vehicleType,
        available: true
      };

      const formData = new FormData();
      formData.append('vehicle', new Blob([JSON.stringify(vehicle)], { type: 'application/json' }));
      formData.append('imageFileName', this.selectedFile); // 👈 nom du champ exact du backend

      this.customVehicleService.addVehicleWithImage(formData).subscribe({
        next: (data) => {
          console.log('✅ Vehicle created', data);
          this.router.navigate(['/vehicles']);
        },
        error: (err) => {
          console.error('❌ Error creating vehicle', err);
          alert("Erreur lors de l'ajout du véhicule !");
        }
      });
    } else {
      alert("⚠️ Please fill out all fields and select an image!");
    }
  }




}




