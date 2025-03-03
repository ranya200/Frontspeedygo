import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';  // Import Router
import { AdControllerService } from 'src/app/openapi';
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
      status: ['PENDING', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.adForm.valid) {
      const formattedData = {
        ...this.adForm.value,
        startDate: new Date(this.adForm.value.startDate).toISOString(), // Assurez-vous que la date est au format ISO
        endDate: new Date(this.adForm.value.endDate).toISOString()
      };

      this.adService.createAd(formattedData).subscribe({
        next: () => {
          alert('Annonce soumise avec succès!');
          this.router.navigate(['/adlist']).then(() => {
            window.location.reload();  // Ceci force le rechargement de la page, ce qui n'est pas idéal pour une SPA
          });
        },
        error: (err) => {
          console.error('Erreur lors de la soumission', err);
          alert(`Erreur: ${err.error?.message || 'Veuillez vérifier les données saisies'}`);
        }
      });
    }
  }
}