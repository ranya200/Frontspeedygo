import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Promotion, PromotionControllerService } from 'src/app/openapi';
import { HeaderFrontComponent } from '../header-front/header-front.component';
import { FooterFrontComponent } from '../footer-front/footer-front.component';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent],
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
  promotionForm!: FormGroup;
  promotions: Promotion[] = []; // Store all promotions
  selectedPromotion: Promotion | null = null; // Track the promotion being edited

  constructor(private fb: FormBuilder, private promotionService: PromotionControllerService) {}

  ngOnInit(): void {
    this.promotionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      discountType: ['POURCENTAGE', Validators.required], // Default discount type
      discount: [null, [Validators.min(0)]], // Only required for percentage/fixed amount
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      promotionStatus: ['ACTIVE', Validators.required] // Default status
    });

    // Watch discountType changes and adjust discount validation
    this.promotionForm.get('discountType')?.valueChanges.subscribe((value) => {
      if (value === 'FREEDELIVERY') {
        this.promotionForm.get('discount')?.setValidators([]);
        this.promotionForm.get('discount')?.setValue(null);
      } else {
        this.promotionForm.get('discount')?.setValidators([Validators.required, Validators.min(0)]);
      }
      this.promotionForm.get('discount')?.updateValueAndValidity();
    });

    this.getAllPromotions();
  }

  onSubmit(): void {
    if (this.promotionForm.valid) {
      const promotionRequest: Promotion = this.promotionForm.value;
      this.promotionService.addPromotion(promotionRequest).subscribe({
        next: () => {
          alert('Promotion ajoutée avec succès !');
          this.getAllPromotions(); // Refresh promotions list after submission
          this.promotionForm.reset(); // Reset form after successful submission
          this.promotionForm.patchValue({ discountType: 'POURCENTAGE', promotionStatus: 'ACTIVE' }); // Reset default values
        },
        error: (err) => console.error("Erreur lors de l'ajout de la promotion", err)
      });
    }
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

  editPromotion(promotion: Promotion): void {
    this.selectedPromotion = { ...promotion }; // Clone the object to avoid direct modification
    this.promotionForm.patchValue(this.selectedPromotion);
  }

  updatePromotion(): void {
    if (this.promotionForm.valid && this.selectedPromotion) {
      const updatedPromotion: Promotion = {
        ...this.selectedPromotion,
        ...this.promotionForm.value
      };

      this.promotionService.updatePromotion(updatedPromotion).subscribe({
        next: () => {
          alert('Promotion mise à jour avec succès !');
          this.getAllPromotions(); // Refresh the list after update
          this.cancelEdit(); // Reset the form
        },
        error: (err) => console.error("Erreur lors de la mise à jour", err)
      });
    }
  }

  cancelEdit(): void {
    this.selectedPromotion = null;
    this.promotionForm.reset();
    this.promotionForm.patchValue({ discountType: 'POURCENTAGE', promotionStatus: 'ACTIVE' }); // Reset default values
  }
}
