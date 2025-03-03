import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarBackComponent } from "../../navbar-back/navbar-back.component";
import { SidebarBackComponent } from "../../sidebar-back/sidebar-back.component";
import { FormsModule } from '@angular/forms';
import { DeliveryControllerService, Delivery } from '../../../openapi';


@Component({
  selector: 'app-delivery-edit',
  imports: [
    CommonModule, // ✅ Required for `*ngFor`
    FormsModule, // ✅ Ensure FormsModule is included
    ReactiveFormsModule ,//✅ Required for `formControlName`
    NavbarBackComponent,
    SidebarBackComponent
  ],
  templateUrl: './delivery-edit.component.html',
  standalone: true,
  styleUrl: './delivery-edit.component.css'
})
export class DeliveryEditComponent implements OnInit {
  deliveryForm!: FormGroup;
  deliveryId!: string;
  isLoading: boolean = true;
  deliveryStatuses: string[] = ['Pending','InRoad','Done'];
  pamentStatuses: string[] = Object.values(Delivery.PamentStatusEnum);
  status  = ['PENDING', 'APPROVED', 'REJECTED'];
  deliveries: any[] = [];

  constructor(
    private deliveryService: DeliveryControllerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize the form with default values from the enums.
    this.deliveryForm = this.fb.group({
      // Optionally include idD if needed (for update scenarios)
      idD: [''],
      // New driverId control added; you can set Validators.required if needed
      driverId: ['', Validators.required],
      deliveryStatus: [Delivery.DeliveryStatusEnum.Pending, Validators.required],
      estimatedDeliveryTime: ['', Validators.required],
      // Optionally include userId control if needed
      userId: [''],
      pamentStatus: [Delivery.PamentStatusEnum.Unpaid, Validators.required],
      status: ['pending']
    });
    this.deliveryId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.deliveryId) {
      alert('❌ Delivery ID not found!');
      this.router.navigate(['/deliveries']);
    } else {
      this.loadDelivery();
    }
  }
  loadDelivery(): void {
    this.deliveryService.getDelivery(this.deliveryId).subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convert Blob to text
          const delivery = JSON.parse(text);
          this.deliveryForm.patchValue(delivery);
        } else {
          this.deliveryForm.patchValue(response);
        }
        console.log('✅ Form Valid After Patch:', this.deliveryForm.valid);
        console.log('✅ Form Values:', this.deliveryForm.value);
      },
      error: (err) => console.error('❌ Error loading delivery:', err)
    });
  }
  onSubmit(): void {
    if (this.deliveryForm.valid) {
      const updatedDelivery: Delivery = this.deliveryForm.value;

      this.deliveryService.modifydelivery(this.deliveryId, updatedDelivery).subscribe({
        next: (response) => {
          console.log('✅ Delivery updated successfully:', response);
          alert('Delivery updated successfully!');
          this.router.navigate(['/deliveries']);
        },
        error: (err) => {
          console.error('❌ Error updating delivery:', err);
          alert('Failed to update delivery. Please try again.');
        }
      });
    } else {
      console.error('❌ Form is invalid!');
      alert('Please fill in all the required fields.');
    }
  }
  cancelEdit(): void {
    this.router.navigate(['/deliveries']);
  }


}
