import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentControllerService, Payment } from '../../../openapi';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  imports: [CommonModule, FormsModule],
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
      // Vous pouvez aussi récupérer orderId si besoin
      // const orderId = params['orderId'];
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
