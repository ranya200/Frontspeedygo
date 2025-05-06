import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaymentControllerService, Payment } from '../../../openapi';

@Component({
  selector: 'app-payment-cancel',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './payment-cancel.component.html',
  styleUrls: ['./payment-cancel.component.css']
})
export class PaymentCancelComponent {
  constructor(private paymentService: PaymentControllerService) {}

  ngOnInit(): void {
    const failedPayment: Payment = {
      amount: 0, // ou à récupérer via queryParams
      paymentType: 'CARD',
      userId: '...', // à remplir si disponible
      packageId: '...', // idem
      status: false,
      paymentDate: new Date().toISOString()
    };

    this.paymentService.recordFailedPayment(failedPayment).subscribe({
      next: () => console.log('📉 Paiement annulé enregistré'),
      error: err => console.error('❌ Erreur enregistrement échec', err)
    });
  }

}
