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
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (sessionId) {
      this.paymentService.verifyAndRecord(sessionId).subscribe({
        next: () => {
          const interval = setInterval(() => {
            this.countdown--;
            if (this.countdown === 0) {
              clearInterval(interval);
              this.router.navigate(['/produitsclient']);
            }
          }, 1000);
        },
        error: err => console.error('❌ Paiement non vérifié côté serveur', err)
      });
    }
  }
}
