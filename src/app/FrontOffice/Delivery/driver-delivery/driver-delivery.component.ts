import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {DeliveryControllerService, Delivery, FastPost} from '../../../openapi';
import { DatePipe, NgForOf } from '@angular/common';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-delivery',
  imports: [CommonModule],
  templateUrl: './/src/app/FrontOffice/Delivery/driver-delivery/driver-delivery.component.html',
  standalone: true,
  styleUrls: ['./driver-delivery.component.css']
})
export class DriverDeliveryComponent implements OnInit {
  deliveries: Delivery[] = [];
  driverId: string = ''; // To store the current driver ID, replace this with the actual ID from your authentication service.

  constructor(
    private deliveryService: DeliveryControllerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the driverId from the route or your authentication service.
    // For demonstration purposes, I’m assuming that you get the driverId here.
    this.driverId = 'driverId-placeholder'; // Replace this with actual driver ID from authentication or routing parameters.
    this.loadDeliveriesForDriver(this.driverId);
  }

  // Method to load deliveries for the specific driver
  loadDeliveriesForDriver(driverId: string): void {
    this.deliveryService.getDeliveriesForDriver(driverId).subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convert Blob to text
          this.deliveries = JSON.parse(text); // Parse as JSON
        } else {
          this.deliveries = response; // Already a JSON array
        }
        console.log("Loaded deliveries:", this.deliveries);
      },
      error: (err) => {
        console.error('Error fetching deliveries:', err);
        alert('Error loading deliveries.');
      }
    });
  }

  approveDelivery(delivery :Delivery): void {
    if (confirm("whould you accept this Delivery  ?")) {
      this.deliveryService.approveDelivery(delivery.idD!).subscribe({
        next: () => {
          alert("The delivery is accepted !");
          this.loadDeliveriesForDriver(this.driverId); // Refresh the list
        },
        error: (err) => console.error("Error", err)
      });
    }
  }

  rejectDelivery(delivery :Delivery): void {
    if (confirm("whould you accept this Delivery  ?")) {
      this.deliveryService.rejectDelivery(delivery.idD!).subscribe({
        next: () => {
          alert("The delivery is rejected !");
          this.loadDeliveriesForDriver(this.driverId); // Refresh the list
        },
        error: (err) => console.error("Error", err)
      });
    }
  }

  deleteDelivery(driverId: string | undefined): void {
    if (confirm("Are you sure you want to delete this delivery ?")) {
      if (typeof driverId === "string") {
        this.deliveryService.removeDelivery(driverId).subscribe({
          next: () => {
            this.deliveries = this.deliveries.filter(d => d.idD !== driverId);
            console.log(`🗑️ Vehicle ${driverId} deleted successfully.`);
          },
          error: (err) => console.error("❌ Error deleting this request:", err),
        });
      }
    }
  }
}
