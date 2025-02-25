import { Component, OnInit } from '@angular/core';
import { OrderControllerService, Order, OrderItem } from '../../../openapi';
import { ProductControllerService, Product } from '../../../openapi';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { Router } from '@angular/router';
import {HeaderFrontComponent} from "../../header-front/header-front.component";
import {FooterFrontComponent} from "../../footer-front/footer-front.component";

interface ExtendedProduct extends Product {
  selectedQuantity?: number;
}

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  imports: [CommonModule,
    FormsModule, HeaderFrontComponent, FooterFrontComponent
  ],
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {
  // Utilisez ExtendedProduct pour inclure selectedQuantity
  products: ExtendedProduct[] = [];

  order: Order = { price: 0, items: [] };

  constructor(
    private orderService: OrderControllerService,
    private productService: ProductControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Charger la liste des produits via le service OpenAPI généré
    this.productService.listProducts().subscribe({
      next: data => this.products = data as ExtendedProduct[],
      error: err => console.error('Erreur lors du chargement des produits', err)
    });
  }

  // Ajoute un produit à la commande avec la quantité spécifiée
  addProductToOrder(product: ExtendedProduct, quantity: number): void {
    if (quantity > 0) {
      const orderItem: OrderItem = {
        productId: product.id,
        quantity: quantity,
        price: product.price
      };
      this.order.items!.push(orderItem);
      this.calculateTotal();
    }
  }

  // Calcule le prix total de la commande
  calculateTotal(): void {
    this.order.price = (this.order.items ?? []).reduce(
      (total, item) => total + ((item.price ?? 0) * (item.quantity ?? 0)),
      0
    );
  }

  submitOrder(): void {
    this.orderService.createOrder(this.order).subscribe({
      next: response => {
        console.log('Commande créée avec succès', response);
        // Naviguer vers la page de paiement en passant l'ID ou le montant
        this.router.navigate(['/payment'], { queryParams: { amount: response.price, orderId: response.id } });
      },
      error: err => console.error('Erreur lors de la création de la commande', err)
    });
  }


}
