import {Component, OnInit} from '@angular/core';
import {Order, OrderControllerService} from "../../../openapi";
import {DatePipe, NgForOf} from "@angular/common";
import {NavbarBackComponent} from "../../navbar-back/navbar-back.component";
import {SidebarBackComponent} from "../../sidebar-back/sidebar-back.component";
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-deliveries-list',
  standalone: true,
  imports: [
    DatePipe,
    NavbarBackComponent,
    SidebarBackComponent,
    NgForOf
  ],
  templateUrl: './deliveries-list.component.html',
  styleUrl: './deliveries-list.component.css'
})
export class DeliveriesListComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderControllerService,
              private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.listOrders().subscribe({
      error: (err) => console.error('❌ Erreur lors de la récupération des commandes', err),
      next: async (response) => {
        if (!(response instanceof Blob)) {
          this.orders = response as Order[];
        } else {
          const text = await response.text();
          this.orders = JSON.parse(text);
        }
        console.log("📦 Commandes reçues :", this.orders);
      }
    });
  }

  startDelivery(orderId: string | undefined): void {
    console.log('🚚 Démarrage livraison pour commande ID:', orderId);
    alert(`Démarrage de la livraison pour la commande ${orderId}`);
  }
  // ✅ Nouvelle méthode : Affectation automatique
  assignDeliveries(): void {
    this.http.put('http://localhost:8089/speedygo/api/delivery/assign-pending', {}).subscribe({
      next: () => {
        alert("✅ Livraisons affectées automatiquement !");
        this.loadOrders(); // 🔁 Recharge la liste
      },
      error: (err) => console.error("❌ Erreur assignation", err)
    });
  }
}
