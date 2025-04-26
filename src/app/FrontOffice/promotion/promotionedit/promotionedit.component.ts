import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Promotion, PromotionControllerService } from 'src/app/openapi';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promotionedit',
  standalone: true,
  imports: [HeaderFrontComponent, FooterFrontComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './promotionedit.component.html',
  styleUrl: './promotionedit.component.css'
})
export class PromotioneditComponent  {
  /*promotionForm!: FormGroup;
  promotionId!: string; // Store the ID from the URL

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private promoService: PromotionControllerService
  ) {}

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

    // Load leave data
    this.loadpromotionData();
  }

  loadpromotionData(): void {
    this.promoService.getPromotion(this.promotionId).subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convert Blob to text
          const leave = JSON.parse(text); // Convert text to JSON
          this.promotionForm.patchValue(leave); // Populate the form
        } else {
          this.promotionForm.patchValue(response); // Directly populate if already JSON
        }
        console.log("Données reçues pour modification :", response);
      },
      error: (err) => console.error('Erreur lors de la récupération du congé', err)
    });
  }
  

  updatePromotion(): void {
    if (this.promotionForm.valid) {
      const updatedLeave: Promotion = {
        ...this.promotionForm.value,
        id: this.promotionId // Ensure the ID is included
      };

      this.promoService.updatePromotion(updatedLeave).subscribe({
        next: () => {
          alert('Demande de congé mise à jour avec succès !');
          this.router.navigate(['/promo']); // Redirect back to list page
        },
        error: (err) => console.error('Erreur lors de la mise à jour', err)
      });
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/promo']); // Navigate back to the list
  }*/
}
