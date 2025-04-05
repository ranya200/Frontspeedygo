import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentControllerService, Payment } from '../../../openapi';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
  standalone: true
})
export class PaymentSuccessComponent implements OnInit {
  countdown = 3;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentControllerService
  ) {}

  ngOnInit(): void {
    const amount = +this.route.snapshot.queryParamMap.get('amount')!;
    const userId = this.route.snapshot.queryParamMap.get('userId')!;
    const packageId = this.route.snapshot.queryParamMap.get('packageId')!;
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (sessionId) {
      const savedPayment: Payment = {
        amount,
        paymentType: 'CARD',
        userId,
        packageId,
        status: true,
        paymentDate: new Date().toISOString()
      };

      this.paymentService.recordSuccessfulPayment(savedPayment).subscribe({
        next: () => {
          const interval = setInterval(() => {
            this.countdown--;
            if (this.countdown === 0) {
              clearInterval(interval);
              this.router.navigate(['/produitsclient']);
            }
          }, 1000);
        },
        error: err => console.error('❌ Erreur lors de l’enregistrement du paiement', err)
      });
    }
  }
}
