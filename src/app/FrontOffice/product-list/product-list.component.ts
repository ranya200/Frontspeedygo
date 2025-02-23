import {Component, OnInit} from '@angular/core';
import { ProductControllerService, Product } from '../../openapi';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,  // Optionnel, si vous utilisez des composants standalone
  imports: [CommonModule], // Ajoutez CommonModule ici
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string = '';

  constructor(private productService: ProductControllerService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.listProducts().subscribe({
      next: (data: Product[]) => this.products = data,
      error: (err) => {
        console.error('Erreur de chargement', err);
        this.errorMessage = 'Erreur de chargement des produits.';
      }
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log('Produit supprimé');
          this.loadProducts(); // Recharge la liste après suppression
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  editProduct(id: string): void {
    // Redirection vers le composant d'édition
    this.router.navigate(['/edit-product', id]);
  }
}
