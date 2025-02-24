import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductControllerService, Product } from '../../../openapi';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HeaderFrontComponent} from "../../header-front/header-front.component";
import {FooterFrontComponent} from "../../footer-front/footer-front.component";

@Component({
  selector: 'app-product-create',
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent implements OnInit {
  productForm!: FormGroup;
// Liste des catégories valides (adapter selon votre enum réel)
  categories: string[] = ['FOOD', 'ELECTRONICS', 'CLOTHING'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductControllerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      stockQuantity: [0, Validators.required],
      category: [''], // Adapter si c'est un objet ou un enum
      image: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      this.productService.addProduct(product).subscribe({
        next: (data) => {
          console.log('Produit créé', data);
          this.router.navigate(['/product']); // Redirection vers la liste des produits
        },
        error: (err) => console.error('Erreur lors de la création', err)
      });
    }
  }
}
