import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentControllerService, Payment } from 'src/app/openapi';
import { jwtDecode } from 'jwt-decode';
import {FooterFrontComponent} from "../../footer-front/footer-front.component";
import {HeaderFrontComponent} from "../../header-front/header-front.component";

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, FooterFrontComponent, HeaderFrontComponent],
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {
  payments: Payment[] = [];

  constructor(private paymentService: PaymentControllerService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      const userId = decoded.sub; // ✅ C'est celui qu'on voit dans MongoDB
      console.log('User ID utilisé pour la recherche des paiements :', userId);

      this.paymentService.getPaymentsByUser(userId).subscribe({
        next: (data) => {
          console.log('✅ Paiements récupérés :', data);
          this.payments = data;
        },
        error: (err) => console.error('❌ Erreur lors de la récupération des paiements', err)
      });
    }
  }
}
