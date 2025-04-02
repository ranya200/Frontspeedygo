import { Component, OnInit } from '@angular/core';
import { ProductControllerService, Product, PanierControllerService } from '../../../openapi';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from "../../header-front/header-front.component";
import { FooterFrontComponent } from "../../footer-front/footer-front.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-product-list',
  standalone: true,
  imports: [CommonModule, HeaderFrontComponent, FooterFrontComponent, FormsModule],
  templateUrl: './client-product-list.component.html',
  styleUrl: './client-product-list.component.css'
})
export class ClientProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories = Object.values(Product.CategoryEnum);
  selectedCategory: string = 'ALL';
  errorMessage: string = '';
  quantities: { [key: string]: number } = {}; // Pour stocker les quantités entrées

  constructor(
    private productService: ProductControllerService,
    private panierService: PanierControllerService, // ✅ Inject package service
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.listProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filterProducts();
      },
      error: (err) => {
        console.error('Erreur de chargement', err);
        this.errorMessage = 'Erreur de chargement des produits.';
      }
    });
  }

  filterProducts(): void {
    if (this.selectedCategory === 'ALL') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category === this.selectedCategory);
    }
  }

  addToPackage(product: Product): void {
    const quantity = this.quantities[product.id!] || 1;

    const request = {
      product,
      quantity: { value: quantity }
    };

    this.panierService.addProductToPackage(request).subscribe({
      next: () => alert('Produit ajouté au package !'),
      error: (err) => console.error('Erreur ajout package', err)
    });
  }

  viewProductDetails(id: string): void {
    this.router.navigate(['/product-detail', id]);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterProducts();
  }
}
