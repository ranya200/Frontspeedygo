import { Component, OnInit } from '@angular/core';
import { ProductControllerService, Product, PanierControllerService } from 'src/app/openapi';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from "../../header-front/header-front.component";
import { FooterFrontComponent } from "../../footer-front/footer-front.component";
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, HeaderFrontComponent, FooterFrontComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories = Object.values(Product.CategoryEnum);
  selectedCategory: string = 'ALL';
  errorMessage: string = '';

  constructor(
    private productService: ProductControllerService,
    private panierService: PanierControllerService, // ✅ Inject package service
    public router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      const roles: string[] = decoded.realm_access?.roles || [];

      if (roles.includes('partner')) {
        this.loadPartnerProducts();
      } else {
        this.loadAllProducts(); // admin or client
      }
    }
  }

  loadPartnerProducts(): void {
    this.productService.getMyProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filterProducts();
      },
      error: (err) => {
        console.error('Erreur de chargement (partenaire)', err);
        this.errorMessage = 'Erreur de chargement de vos produits.';
      }
    });
  }

  loadAllProducts(): void {
    this.productService.listProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filterProducts();
      },
      error: (err) => {
        console.error('Erreur de chargement (admin/client)', err);
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
          this.loadPartnerProducts();
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
