import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentControllerService, Payment } from '../../../openapi';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    HeaderFrontComponent,
    FooterFrontComponent
  ]
})
export class PaymentFormComponent implements OnInit {
  payment: Payment = { amount: 0, paymentType: 'CARD' };

  otpSent = false;
  otpVerified = false;
  otpCode = '';
  otpError = '';
  otpSuccess = false;

  constructor(
    private paymentService: PaymentControllerService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.payment.amount = +params['amount'] || 0;
      this.payment.packageId = params['packageId'];
      this.payment.userId = params['userId'];
      this.payment.orderId = params['orderId'];
    });
  }

  sendOtp(): void {
    this.otpError = '';

    const phoneNumber = '+21629422887';

    this.http.post('http://localhost:8089/speedygo/api/otp/send', null, {
      params: { phoneNumber },
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.otpSent = true;
        console.log("✅ otpSent =", this.otpSent); // 👈 ici
        alert("✅ OTP envoyé !");
      },
      error: (err) => {
        this.otpError = "Erreur lors de l'envoi de l'OTP.";
        console.error(err);
      }
    });
  }

  onOtpInputChange(): void {
    if (this.otpCode.length === 6) {
      const phoneNumber = '+21629422887'; // ✅ même numéro que pour l’envoi

      this.http.post('http://localhost:8089/speedygo/api/otp/verify', null, {
        params: { phoneNumber, code: this.otpCode },
        responseType: 'text'
      }).subscribe({
        next: () => {
          this.otpVerified = true;
          this.otpSuccess = true;
          this.otpError = '';
        },
        error: (err) => {
          console.error('🧨 Erreur vérification OTP :', err); // 🔍 voir le vrai message
          this.otpVerified = false;
          this.otpSuccess = false;
          this.otpError = '❌ OTP incorrect';
        }
      });
    }
  }

  processPayment(): void {
    if (!this.otpVerified) {
      alert("Veuillez valider l'OTP avant de payer.");
      return;
    }

    this.paymentService.createCheckoutSession(this.payment).subscribe({
      next: (res) => {
        if (res['checkoutUrl']) {
          window.location.href = res['checkoutUrl'];
        }
      },
      error: (err) => {
        console.error('❌ Erreur lors de la requête Stripe :', err);
      }
    });
  }
}
