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
  standalone: true,
  styleUrls: ['./delivery-assignment.component.css']
})
export class DeliveryAssignmentComponent implements OnInit {
  deliveryForm!: FormGroup;

  // Build arrays using the enums from the generated Delivery model.
  deliveryStatuses: string[] = ['Pending','InRoad','Done'];
  pamentStatuses: string[] = Object.values(Delivery.PamentStatusEnum);
  status  = ['PENDING', 'APPROVED', 'REJECTED'];
  deliveries: any[] = [];

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
      pamentStatus: [Delivery.PamentStatusEnum.Unpaid, Validators.required],
      status: ['pending']
    });

  }


  onSubmit(): void {
    if (this.deliveryForm.valid) {
      const newDelivery = {
        ...this.deliveryForm.value,
        idD: null, // 🚀 Ensure MongoDB generates a new ID
        driverId: this.deliveryForm.value.driverId || null,
        userId: this.deliveryForm.value.userId || null
      };

      console.log("📌 Debugging Submitted Delivery:", JSON.stringify(newDelivery, null, 2));

      this.deliveryService.addDelivery(newDelivery).subscribe({
        next: (response: any) => {
          console.log("✅ Delivery created successfully!", response);
          this.router.navigate(['/deliveries']);
          alert("🚀 Delivery submitted successfully!");
          this.deliveries = [...this.deliveries, response]; // Append new delivery
          this.deliveryForm.reset(); // Clear form after adding
        },
        error: (err) => {
          console.error("❌ Error submitting delivery:", err);
        }
      });
    } else {
      console.error("❌ Form is invalid:", this.deliveryForm.errors);
      alert("⚠️ Please fill in all required fields.");
    }
  }




}
