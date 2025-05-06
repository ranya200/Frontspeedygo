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
  selectedFile!: File;

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
      weight: [0, Validators.required], // ✅ ajouté ici
      category: ['', Validators.required],
      image: ['', Validators.required]
    });

  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFile) {
      const product: Product = this.productForm.value;
      const image: Blob = this.selectedFile; // votre fichier sélectionné

      this.productService.addProduct(product, image).subscribe({
        next: (data) => {
          console.log('Produit créé', data);
          this.router.navigate(['/product']); // Redirection vers la liste des produits
        },
        error: (err) => console.error('Erreur lors de la création', err)
      });
    } else {
      console.error("Formulaire invalide ou image non sélectionnée");
    }
  }


  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      // Met à jour le contrôle "image" avec le nom du fichier
      this.productForm.patchValue({ image: this.selectedFile.name });
    }
  }


}
