import { Component, OnInit } from '@angular/core';
import { Product } from '../../../openapi/model/product';
import { Panier, PanierControllerService } from 'src/app/openapi';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [FooterFrontComponent, HeaderFrontComponent, CommonModule],
  templateUrl: './package-list.component.html',
  styleUrl: './package-list.component.css'
})
export class PackageListComponent implements OnInit {
  packageData: Panier | null = null;
  errorMessage: string = '';

  constructor(private panierService: PanierControllerService) {}

  ngOnInit(): void {
    this.loadPackage();
  }




  // ✅ Fetch package details
  loadPackage(): void {
    this.panierService.getPackage().subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convertir Blob en texte
          this.packageData = JSON.parse(text); // Convertir en JSON
        } else {
          this.packageData = response; // Déjà un tableau JSON
        }
        console.log("Données reçues :", this.packageData);
      },
      error: (err) => {
        console.error('Erreur de chargement du package', err);
        this.errorMessage = 'Erreur de chargement du package.';
      }
    });
  }

  // ✅ Remove a product from the package
  removeProduct(productId: string): void {
    if (confirm('Voulez-vous supprimer ce produit du package ?')) {
      this.panierService.removeProductFromPackage(productId).subscribe({
        next: () => {
          this.loadPackage(); // Refresh after removing product
          alert('Produit supprimé du package.');
        },
        error: (err) => console.error('Erreur suppression produit', err)
      });
    }
  }
}
