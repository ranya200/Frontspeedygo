import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductControllerService, Product } from '../../../openapi';
import { CommonModule } from '@angular/common';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, HeaderFrontComponent, FooterFrontComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID récupéré depuis l’URL :', id);
    if (id) {
      this.productService.getProduct(id).subscribe({
        next: (data) => {
          console.log('Produit récupéré :', data);
          this.product = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération du produit', err);
          this.isLoading = false;
          // Afficher un message d'erreur ou rediriger
        }
      });
    } else {
      this.isLoading = false;
      console.error('Aucun ID fourni dans l’URL');
    }
  }

  goBack(): void {
    this.router.navigate(['/productsclient']);
  }
}
