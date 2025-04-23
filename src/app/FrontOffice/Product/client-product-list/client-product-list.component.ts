import { Component, OnInit } from '@angular/core';
import { ProductControllerService, Product, PanierControllerService } from 'src/app/openapi';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from "../../header-front/header-front.component";
import { FooterFrontComponent } from "../../footer-front/footer-front.component";
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import {StarRatingComponent} from "../star-rating-component/star-rating-component.component";


@Component({
  selector: 'app-client-product-list',
  standalone: true,
  imports: [CommonModule, HeaderFrontComponent, FooterFrontComponent, FormsModule, StarRatingComponent],
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
  averageRatings: { [productId: string]: number } = {};
  userRatings: { [productId: string]: number } = {};
  userId: string = '';

  constructor(
    private http: HttpClient,
    private productService: ProductControllerService,
    private panierService: PanierControllerService, // ✅ Inject package service
    public router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.sub;
    }
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
    this.loadRatings(); // ✅ Ajout nécessaire ici
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




loadRatings(): void {
  for (let product of this.filteredProducts) {
  this.http.get<number>(`http://localhost:8089/speedygo/ratings/average/${product.id}`).subscribe(avg => {
    this.averageRatings[product.id!] = avg;
  });

  this.http.get<any>(`http://localhost:8089/speedygo/ratings/user/${this.userId}/product/${product.id}`)
    .subscribe(r => this.userRatings[product.id!] = r?.rating ?? 0);
}
}

rateProduct(productId: string, rating: number): void {
  const payload = { userId: this.userId, productId, rating };
  this.http.post(`http://localhost:8089/speedygo/ratings/rate`, payload).subscribe(() => {
    this.userRatings[productId] = rating;
    this.loadRatings();
  });
}

}
