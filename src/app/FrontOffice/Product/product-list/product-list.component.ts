import { Component, OnInit } from '@angular/core';
import { ProductControllerService, Product } from '../../../openapi';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from "../../header-front/header-front.component";
import { FooterFrontComponent } from "../../footer-front/footer-front.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HeaderFrontComponent, FooterFrontComponent, ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories = Object.values(Product.CategoryEnum); // Extract category values
  selectedCategory: string = 'ALL';
  errorMessage: string = '';

  constructor(private productService: ProductControllerService, public router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.listProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filterProducts(); // Filter products after loading
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

  deleteProduct(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log('Produit supprimé');
          this.loadProducts();
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  editProduct(id: string): void {
    this.router.navigate(['/edit-product', id]);
  }

  viewProductDetails(id: string): void {
    this.router.navigate(['/product-detail', id]);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterProducts();
  }
}
