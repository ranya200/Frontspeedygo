import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Promotion, PromotionControllerService } from 'src/app/openapi';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promotionlist',
  standalone: true,
  imports: [HeaderFrontComponent, FooterFrontComponent, CommonModule, RouterLink],
  templateUrl: './promotionlist.component.html',
  styleUrl: './promotionlist.component.css'
})
export class PromotionlistComponent {
  
  /*promotionForm!: FormGroup;
  promotions: Promotion[] = []; // Store all promotions
  selectedPromotion: Promotion | null = null; // Track the promotion being edited
  
  constructor(private fb: FormBuilder, private promotionService: PromotionControllerService, private router: Router) { }
  
  ngOnInit(): void {
      this.getAllPromotions();
    }

    deletePromotion(id: string): void {
      if (confirm("Voulez-vous vraiment supprimer cette promotion ?")) {
        this.promotionService.deletePromotion(id).subscribe({
          next: () => {
            alert('Promotion supprimée avec succès !');
            this.getAllPromotions(); // Refresh the list after deletion
          },
          error: (err) => console.error("Erreur lors de la suppression", err)
        });
      }
    }
  
    getAllPromotions(): void {
      this.promotionService.listPromotions().subscribe({
        next: async (response) => {
          if (response instanceof Blob) {
            const text = await response.text(); // Convert Blob to text
            this.promotions = JSON.parse(text); // Convert to JSON
          } else {
            this.promotions = response; // Already a JSON array
          }
          console.log("Données reçues :", this.promotions);
        },
        error: (err) => console.error("Erreur lors de la récupération des promotions", err)
      });
    }
  
    editPromotion(id: string): void {
      this.router.navigate(['/promoedit', id]); // Redirect to edit page with leave ID
    }*/

}
