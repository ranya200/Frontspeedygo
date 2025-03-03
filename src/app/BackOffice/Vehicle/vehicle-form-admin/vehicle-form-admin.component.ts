import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleControllerService, Vehicle } from '../../../openapi';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";
import { FormsModule} from '@angular/forms'; // ✅ Ensure these are imported


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

      this.vehicleService.addVehicle( vehicle,  image).subscribe({
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




