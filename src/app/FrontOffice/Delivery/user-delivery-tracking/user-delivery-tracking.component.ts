import { Component, OnInit } from '@angular/core';
import { DeliveryControllerService, Delivery } from '../../../openapi';
import { CommonModule, DatePipe, NgForOf } from '@angular/common';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';

@Component({
  selector: 'app-user-delivery-tracking',
  imports: [CommonModule, DatePipe, NgForOf, HeaderFrontComponent, FooterFrontComponent],
  templateUrl: './user-delivery-tracking.component.html',
  styleUrls: ['./user-delivery-tracking.component.css']
})
export class UserDeliveryTrackingComponent implements OnInit {
  deliveries: Delivery[] = [];


  constructor(private deliveryService: DeliveryControllerService) {}

  ngOnInit(): void {
    // Replace 'userId-placeholder' with the actual user ID from authentication if available.
    this.loadUserDeliveries('userId-placeholder');
  }

  loadUserDeliveries(userId: string): void {
    this.deliveryService.getDeliveriesForUser(userId).subscribe({
      next:  async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convertir Blob en texte
          this.deliveries = JSON.parse(text); // Convertir en JSON
        } else {
          this.deliveries = response; // Déjà un tableau JSON
        }
        console.log("Données reçues :", this.deliveries);
      },
      error: (err) => console.error('Erreur lors de la récupération des congés', err)
    });
  }
}
