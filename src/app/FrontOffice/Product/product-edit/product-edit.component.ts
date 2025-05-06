// src/app/product-edit/product-edit.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductControllerService, Product } from '../../../openapi';
import { ReactiveFormsModule } from '@angular/forms';
import {HeaderFrontComponent} from "../../header-front/header-front.component";
import {FooterFrontComponent} from "../../footer-front/footer-front.component";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent]
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  productId!: string;

  constructor(
    private fb: FormBuilder,
    private productService: ProductControllerService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Initialisation du formulaire avec des valeurs par défaut
    this.productForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      stockQuantity: [0, Validators.required],
      weight: [0, Validators.required],
      category: [''],
      image: ['']
    });

    // Récupération de l'ID depuis les paramètres de la route
    this.productId = this.route.snapshot.paramMap.get('id')!;
    console.log("ID du produit récupéré :", this.productId);

    // Chargement du produit existant et préremplissage du formulaire
    this.productService.getProduct(this.productId).subscribe({
      next: (product: Product) => {
        console.log("Produit récupéré :", product);
        // Mise à jour directe du formulaire
        this.productForm.patchValue(product);
        console.log("Formulaire mis à jour :", this.productForm.value);
        // Optionnel : forcer la détection des changements
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur lors du chargement du produit', err)
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const updatedProduct: Product = this.productForm.value;
      this.productService.updateProduct(updatedProduct).subscribe({
        next: (data) => {
          console.log('Produit mis à jour', data);
          this.router.navigate(['/product']); // Redirection vers la liste après mise à jour
        },
        error: (err) => console.error('Erreur lors de la mise à jour', err)
      });
    }
  }
}
