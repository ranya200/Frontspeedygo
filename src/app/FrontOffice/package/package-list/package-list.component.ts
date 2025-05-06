import { Component, OnInit } from '@angular/core';
import { Product } from '../../../openapi/model/product';
import { OrderItem, Panier, PanierControllerService } from 'src/app/openapi';
import { Order, OrderControllerService } from 'src/app/openapi';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DeliveryEstimateMapComponent } from '../../delivery-estimate-map/delivery-estimate-map.component'; // 👉 à adapter selon ton chemin réel


@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [FooterFrontComponent, HeaderFrontComponent, CommonModule, FormsModule, DeliveryEstimateMapComponent],
  templateUrl: './package-list.component.html',
  styleUrl: './package-list.component.css'
})
export class PackageListComponent implements OnInit {
  packageData: Panier | null = null;
  errorMessage: string = '';

  deliveryDistance = 0;
  deliveryCost = 0;
  totalWeight: number = 0;


  constructor(
    private panierService: PanierControllerService,
    private orderService: OrderControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPackage();
  }

  loadPackage(): void {
    this.panierService.getPackage().subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text();
          this.packageData = JSON.parse(text);
        } else {
          this.packageData = response;
        }
        console.log("Données reçues :", this.packageData);
        this.updateEstimation(); // ✅ pour actualiser après chargement
      },
      error: (err) => {
        console.error('Erreur de chargement du package', err);
        this.errorMessage = 'Erreur de chargement du package.';
      }
    });
  }

  removeProduct(productId: string): void {
    if (confirm('Voulez-vous supprimer ce produit du package ?')) {
      this.panierService.removeProductFromPackage(productId).subscribe({
        next: () => {
          this.loadPackage();
          alert('Produit supprimé du package.');
        },
        error: (err) => console.error('Erreur suppression produit', err)
      });
    }
  }

  updateQuantity(productId: string, quantity: number | undefined): void {
    if (!quantity) return;
    this.panierService.updateProductQuantity(productId, quantity).subscribe({
      next: () => this.loadPackage(),
      error: (err) => console.error('Erreur mise à jour quantité', err)
    });
  }

  calculateDeliveryCost(weight: number, distance: number): number {
    return Math.round((weight * 0.5 + distance * 0.8 + Number.EPSILON) * 100) / 100;
  }

  updateEstimation(): void {
    if (!this.packageData || !this.packageData.products) {
      this.totalWeight = 0;
      this.deliveryCost = 0;
      return;
    }

    console.log("📦 Produits dans le package :");
    this.packageData.products.forEach(p => {
      console.log(
        `➡️ Nom: ${p.product?.name}, Weight: ${p.product?.weight}, Quantity: ${p.quantity}`
      );
    });

    this.totalWeight = this.packageData.products
      .map(p => {
        const weight = Number(p.product?.weight) || 0;
        const qty = Number(p.quantity) || 0;
        return weight * qty;
      })
      .reduce((a, b) => a + b, 0);

    this.deliveryCost = this.calculateDeliveryCost(this.totalWeight, this.deliveryDistance);

    console.log(`✅ Poids total: ${this.totalWeight} kg`);
    console.log(`🚚 Prix livraison estimé: ${this.deliveryCost} €`);
  }



  goToPayment(): void {
    if (!this.packageData || !this.packageData.products) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token JWT non trouvé');
      return;
    }

    const helper = new JwtHelperService();
    const decoded = helper.decodeToken(token);
    const userId = decoded?.sub;

    const items: OrderItem[] = this.packageData.products.map((p: any) => ({
      productId: p.id || p.product?.id,
      productName: p.name || p.product?.name,
      unitPrice: p.price || p.product?.price,
      quantity: p.quantity
    }));

    const orderPayload: Order = {
      trackingNumber: 'TRK-' + Math.random().toString().slice(2, 8),
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      price: (this.packageData?.totalPrice || 0) + this.deliveryCost, // ✅ prix total incluant livraison
      priority: Order.PriorityEnum.Medium,
      status: Order.StatusEnum.Pending,
      date: new Date().toISOString(),
      userId: userId,
      items: items
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: (createdOrder) => {
        this.router.navigate(['/payment'], {
          queryParams: {
            amount: orderPayload.price,
            packageId: this.packageData!.id,
            userId: userId,
            orderId: createdOrder.id
          }
        });
      },
      error: (err) => console.error('Erreur création de commande', err)
    });
  }
}
