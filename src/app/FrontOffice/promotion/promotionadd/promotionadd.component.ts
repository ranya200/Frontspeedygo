import { Component, OnInit } from '@angular/core';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Promotion, PromotionControllerService } from 'src/app/openapi';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-promotionadd',
  standalone: true,
  imports: [FooterFrontComponent, HeaderFrontComponent, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './promotionadd.component.html',
  styleUrl: './promotionadd.component.css'
})
export class PromotionaddComponent {

/*  promotionForm!: FormGroup;
  promotions: Promotion[] = [];
  productId!: string; // Store the ID from the URL



    constructor(private fb: FormBuilder,
       private promotionService: PromotionControllerService,
       private router: Router,
      private route: ActivatedRoute,
      ) { }
  

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

      // Récupération de l'ID depuis les paramètres de la route
    this.productId = this.route.snapshot.paramMap.get('id')!;
    console.log("ID du produit récupéré :", this.productId);

     
    }
  
    onSubmit(): void {
      if (this.promotionForm.valid) {
        console.log('Sending data:', this.promotionForm.value);
        this.promotionService.addPromotionToProduct(
          this.productId,
          this.promotionForm.value
        ).subscribe({
          next: (result) => {
            console.log('Promotion added successfully:', result);
            alert('Promotion added successfully!');
            this.router.navigate(['/product']);  // Ensure this route is correct
          },
          error: (error) => {
            console.error('Failed to add promotion:', error);
            alert('Failed to add promotion: ' + (error.error?.message || error.message));
          }
        });
      }
    }*/
}
