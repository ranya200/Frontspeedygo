import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RecommendationService } from 'src/app/services/recommendation.service';
import { ProductService } from 'src/app/services/product.service';
import { jwtDecode } from 'jwt-decode';

interface Product {
  name: string;
  price: number;
  image: string;
  description?: string;
}

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {
  recommendations: Product[] = [];

  constructor(
    private recommendationService: RecommendationService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const decoded: any = jwtDecode(token!);
    const userId = decoded.sub;

    this.recommendationService.getRecommendations(userId).subscribe(productNames => {
      this.productService.listProducts().subscribe(allProducts => {
        this.recommendations = allProducts.filter(p => productNames.includes(p.name));
        console.log("🧠 Produits recommandés détaillés :", this.recommendations);
      });
    });
  }
}
