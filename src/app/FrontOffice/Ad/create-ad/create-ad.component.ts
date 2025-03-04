import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';  // Import Router
import { Ad, AdControllerService } from 'src/app/openapi';
import { CommonModule } from '@angular/common';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';

@Component({
  standalone: true,
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FooterFrontComponent, HeaderFrontComponent, RouterLink],
})
export class CreateAdComponent implements OnInit {
  adForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adService: AdControllerService,
    private router: Router
  ) {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      image: [''],
      category: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  selectedFile!: File;

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }
  onSubmit(): void {
    if (this.adForm.valid && this.selectedFile) {
      // Formatage des dates
      const formattedData: Ad = {
        ...this.adForm.value,
        startDate: new Date(this.adForm.value.startDate).toISOString(),
        endDate: new Date(this.adForm.value.endDate).toISOString()
      };
  
      const imageBlob = this.selectedFile; // Blob de l'image sélectionnée
  
      // Utiliser la nouvelle méthode du service
      this.adService.createAd(formattedData, imageBlob).subscribe({
        next: () => {
          alert('Annonce soumise avec succès !');
          this.router.navigate(['/adlist']);
        },
        error: (err) => {
          console.error('Erreur lors de la soumission', err);
          alert(`Erreur: ${err.error?.message || 'Veuillez vérifier les données saisies'}`);
        }
      });
    } else {
      alert('Veuillez remplir tous les champs et sélectionner une image.');
    }
  }
  
  
}