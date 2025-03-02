import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ad, AdControllerService } from 'src/app/openapi';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';

@Component({
  selector: 'app-create-ad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FooterFrontComponent, HeaderFrontComponent],
  templateUrl: './create-ad.component.html',
  styleUrl: './create-ad.component.css'
})
export class CreateAdComponent implements OnInit {
  adForm!: FormGroup;

  constructor(private fb: FormBuilder, private adService: AdControllerService) {}

  ngOnInit(): void {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      image: [''],
      category: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['PENDING', Validators.required] // Valeur par défaut "PENDING"
    });
  }



  onSubmit(): void {
    if (this.adForm.valid) {
      const adRequest = this.adForm.value;
      /*const adRequest: Ad = {
        ...formValue,
        startDate: new Date(formValue.startDate).toISOString(),
        endDate: new Date(formValue.endDate).toISOString()
      };*/
      this.adService.createAd(adRequest).subscribe({
        next: () => alert('Annonce soumise avec succès !'),
        error: (err) => {
          console.error('Erreur lors de la soumission', err);
          alert(`Erreur: ${err.error?.message || 'Veuillez vérifier les données saisies'}`);
        }
      });
    }
  }

}
