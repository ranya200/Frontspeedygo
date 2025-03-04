import { Component, OnInit } from '@angular/core';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Promotion, PromotionControllerService } from 'src/app/openapi';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-promotionadd',
  standalone: true,
  imports: [FooterFrontComponent, HeaderFrontComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './promotionadd.component.html',
  styleUrl: './promotionadd.component.css'
})
export class PromotionaddComponent implements OnInit {

  promotionForm!: FormGroup;
  promotions: Promotion[] = []; // Store all promotions


    constructor(private fb: FormBuilder, private promotionService: PromotionControllerService, private router: Router) { }
  

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
  
     
    }
  
    onSubmit(): void {
      if (this.promotionForm.valid) {
        const promotionRequest: Promotion = this.promotionForm.value;
        this.promotionService.addPromotion(promotionRequest).subscribe({
          next: () => {
            alert('Promotion ajoutée avec succès !');
            this.promotionForm.reset(); // Reset form after successful submission
            this.promotionForm.patchValue({ discountType: 'POURCENTAGE', promotionStatus: 'ACTIVE' }); // Reset default values
            this.router.navigate(['/promo']); // Redirect back to list page
          },
          error: (err) => console.error("Erreur lors de l'ajout de la promotion", err)
        });
      }
    }
}
