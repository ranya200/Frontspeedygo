import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentControllerService, Payment } from '../../../openapi';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HeaderFrontComponent} from "../../header-front/header-front.component";
import {FooterFrontComponent} from "../../footer-front/footer-front.component";

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  imports: [CommonModule, FormsModule, HeaderFrontComponent, FooterFrontComponent],
  styleUrls: ['./payment-form.component.css'],
  standalone: true
})
export class PaymentFormComponent implements OnInit {
  payment: Payment = { amount: 0, paymentType: 'CARD' };

  constructor(private paymentService: PaymentControllerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer les paramètres de la route
    this.route.queryParams.subscribe(params => {
      this.payment.amount = +params['amount'] || 0;
      this.payment.packageId = params['packageId'];
      this.payment.userId = params['userId']; // transmis via URL depuis l’appel
    });
  }

  processPayment(): void {
    this.paymentService.processPayment(this.payment).subscribe({
      next: response => {
        console.log('Paiement réussi', response);
      },
      error: err => console.error('Erreur lors du paiement', err)
    });
  }
}
