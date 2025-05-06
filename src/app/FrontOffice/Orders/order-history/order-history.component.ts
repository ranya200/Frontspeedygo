import { Component, OnInit } from '@angular/core';
import { Order, OrderControllerService } from 'src/app/openapi';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';
import {FooterFrontComponent} from "../../footer-front/footer-front.component";
import {HeaderFrontComponent} from "../../header-front/header-front.component";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';

@Component({
  selector: 'app-order-history',
  standalone: true,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  imports: [CommonModule, FooterFrontComponent, HeaderFrontComponent]
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderControllerService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const helper = new JwtHelperService();
      const decoded = helper.decodeToken(token);
      const userId = decoded?.sub;
      console.log('✅ Requête avec userId :', userId);

      this.orderService.getOrdersByUser(userId).subscribe({
        next: async (res: any) => {
          if (res instanceof Blob) {
            const text = await res.text();
            this.orders = JSON.parse(text); // ✅ décodage manuel
            console.log('✅ Résultat décodé :', this.orders);
          } else {
            this.orders = res;
          }
        },
        error: (err) => console.error('❌ Erreur chargement commandes', err)
      });

    }
  }

}
