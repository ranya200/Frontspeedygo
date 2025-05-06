import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentControllerService, PanierControllerService } from '../../../openapi';
import { jwtDecode } from 'jwt-decode';

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
    private paymentService: PaymentControllerService,
    private panierService: PanierControllerService
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (sessionId) {
      this.paymentService.verifyAndRecord(sessionId).subscribe({
        next: () => {
          // 🔐 Récupérer le username depuis le token
          const token = localStorage.getItem('token'); // Assure-toi que c'est la bonne clé
          if (token) {
            const decoded: any = jwtDecode(token);
            const username = decoded.preferred_username; // ou 'sub' selon ce que tu utilises côté backend

            // 🧹 Appel pour vider le panier
            this.panierService.clearPackage(username).subscribe({
              next: () => console.log('✅ Panier vidé côté serveur'),
              error: err => console.warn('⚠️ Erreur lors du vidage du panier', err)
            });
          }

          // ⏳ Redirection après 3 secondes
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
