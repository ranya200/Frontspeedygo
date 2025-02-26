import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryControllerService, Delivery } from '../../../openapi';
import { DatePipe, NgForOf } from '@angular/common';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-delivery',
  imports: [CommonModule, DatePipe, NgForOf, HeaderFrontComponent, FooterFrontComponent],
  templateUrl: './driver-delivery.component.html',
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

  // Method to accept the delivery
  acceptDelivery(delivery: Delivery): void {
    if (confirm(`Are you sure you want to accept this delivery? ${delivery.idD}`)) {
      if (delivery.idD != null) {
        if (delivery.driverId != null) {
          this.deliveryService.acceptDelivery(delivery.idD, delivery.driverId).subscribe({
            next: () => {
              alert('Delivery accepted!');
              // After accepting, you might want to reload the deliveries or update the UI.
              this.loadDeliveriesForDriver(this.driverId);
            },
            error: (err) => {
              console.error('Error accepting delivery:', err);
              alert('Error accepting delivery.');
            }
          });
        }
      }
    }
  }

  // Method to refuse the delivery
  refuseDelivery(delivery: Delivery): void {
    if (confirm(`Are you sure you want to refuse this delivery? ${delivery.idD}`)) {
      if (delivery.idD != null) {
        if (delivery.driverId != null) {
          this.deliveryService.rejectDelivery(delivery.idD, delivery.driverId).subscribe({
            next: () => {
              alert('Delivery refused!');
              // After refusing, you might want to reload the deliveries or update the UI.
              this.loadDeliveriesForDriver(this.driverId);
            },
            error: (err) => {
              console.error('Error refusing delivery:', err);
              alert('Error refusing delivery.');
            }
          });
        }
      }
    }
  }
}
