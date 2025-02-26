import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeliveryControllerService, Delivery } from '../../../openapi';

import { CommonModule, NgForOf } from '@angular/common';
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";

@Component({
  selector: 'app-delivery-assignment',
  imports: [CommonModule, ReactiveFormsModule, NgForOf, NavbarBackComponent, SidebarBackComponent],
  templateUrl: './delivery-assignment.component.html',
  styleUrls: ['./delivery-assignment.component.css']
})
export class DeliveryAssignmentComponent implements OnInit {
  deliveryForm!: FormGroup;

  // Build arrays using the enums from the generated Delivery model.
  deliveryStatuses: string[] = ['Pending','InRoad','Done'];
  pamentStatuses: string[] = Object.values(Delivery.PamentStatusEnum);

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryControllerService,
    private router: Router
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
      pamentStatus: [Delivery.PamentStatusEnum.Unpaid, Validators.required]
    });
  }


  onSubmit(): void {
    if (this.deliveryForm.valid) {
      const delivery: Delivery = this.deliveryForm.value;

      // Debugging: Check the form values before sending
      console.log("Submitting delivery:", delivery);

      this.deliveryService.addDelivery(delivery).subscribe({
        next: (response: any) => {
          console.log('Delivery created successfully!', response);
          alert('Delivery submitted successfully!');
          this.router.navigate(['/deliveries']);
        },
        error: (err) => {
          console.error('Error submitting delivery:', err);
        }
      });

    } else {
      console.error("Form is invalid", this.deliveryForm.errors);
      alert("Please fill in all required fields.");
    }
  }


}
