import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleControllerService, Vehicle } from '../../../openapi';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";

@Component({
  selector: 'app-vehicle-form-admin',
  imports: [
    NavbarBackComponent,
    SidebarBackComponent,
    ReactiveFormsModule
  ],
  templateUrl: './vehicle-form-admin.component.html',
  styleUrl: './vehicle-form-admin.component.css'
})
export class VehicleFormAdminComponent implements OnInit {
  vehicleForm!: FormGroup;
  vehicleId?: string;
  // Use the OpenAPI-generated enum values for defaults
  vehicleStatuses: string[] = [
    Vehicle.VehicleStatusEnum.InServer,
    Vehicle.VehicleStatusEnum.UnderRepair,
    Vehicle.VehicleStatusEnum.OutOfService
  ];
  vehicleTypes: string[] = [
    Vehicle.VehicleTypeEnum.Car,
    Vehicle.VehicleTypeEnum.Van,
    Vehicle.VehicleTypeEnum.MotoCycle
  ];
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleControllerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      capacity: ['', Validators.required],
      licensePlate: ['', Validators.required],
      vin: ['', Validators.required],
      fabricationDate: ['', Validators.required],
      fuelType: ['', Validators.required],
      imageFileName: [''], // This will hold the Base64 string
      //vehicleStatus: [Vehicle.VehicleStatusEnum.InServer, Validators.required],
      vehicleType: [Vehicle.VehicleTypeEnum.Car, Validators.required]
    });
    this.vehicleId = this.route.snapshot.params['id'];
    if (this.vehicleId) {
      this.vehicleService.getVehicle(this.vehicleId).subscribe(
        data => this.vehicleForm.patchValue(data),
        error => console.error('Error fetching vehicle', error)
      );
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.vehicleForm.patchValue({ imageFileName: base64String });
      };
      reader.readAsDataURL(this.selectedFile!);
    }
  }

  onSubmit(): void {
    if (this.vehicleForm.valid) {
      const vehicle: Vehicle = this.vehicleForm.value;
      this.vehicleService.addVehicle(vehicle).subscribe({
        next: (response: any) => {
          console.log('Vehicle created', response);
          alert('Vehicle submitted successfully!');
          this.router.navigate(['/vehicles']);
        },
        error: (err) => {
          console.error('Error submitting vehicle', err);
        }
      });
    } else {
      console.error("Form is invalid");
    }
  }


}




