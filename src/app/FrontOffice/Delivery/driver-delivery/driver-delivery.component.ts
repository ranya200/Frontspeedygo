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

  constructor(
    private deliveryService: DeliveryControllerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Replace 'driverId-placeholder' with the actual driver ID from authentication if available.
    this.loadDeliveriesForDriver('driverId-placeholder');
  }

  loadDeliveriesForDriver(driverId: string): void {
    this.deliveryService.getDeliveriesForDriver(driverId).subscribe({
      next: (data: Delivery[]) => this.deliveries = data,
      error: (error) => console.error('Error fetching deliveries for driver', error)
    });
  }

  acceptDelivery(delivery: Delivery): void {
    alert('Delivery accepted: ' + delivery.idD);
    // Optionally, call a method on deliveryService to update the delivery status.
  }

  refuseDelivery(delivery: Delivery): void {
    alert('Delivery refused: ' + delivery.idD);
    // Optionally, call a method on deliveryService to update the delivery status.
  }
}
