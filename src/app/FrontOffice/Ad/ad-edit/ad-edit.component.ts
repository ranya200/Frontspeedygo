import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Ad, AdControllerService } from 'src/app/openapi';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';

@Component({
  selector: 'app-edit-ad',
  imports: [CommonModule, ReactiveFormsModule, FooterFrontComponent, HeaderFrontComponent, RouterModule],
  templateUrl: './ad-edit.component.html',
  styleUrls: ['./ad-edit.component.css']
})
export class EditAdComponent implements OnInit {
  adForm: FormGroup;
  adId: string = '';


  constructor(
    private fb: FormBuilder,
    private adService: AdControllerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.adForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      image: [''],
      category: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['']
    });
    this.adId = '';
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.adId = params['id'];
      this.loadAdDetails();
    });
  }

  loadAdDetails(): void {
    if (!this.adId) {
      alert('Ad ID is missing');
      return;
    }

    this.adService.getAdById(this.adId).subscribe({
      next: (ad: Ad) => {
        this.adForm.patchValue({
          title: ad.title,
          description: ad.description,
          image: ad.image,
          category: ad.category,
          startDate: ad.startDate?.split('T')[0], // Safe access with optional chaining
          endDate: ad.endDate?.split('T')[0],    // Safe access with optional chaining
          status: ad.status
        });
      },
      error: (err) => {
        console.error('Error fetching ad details:', err.message || err);

        alert('Failed to load advertisement details.');
      }
    });
  }

  onSubmit(): void {
    if (this.adForm.valid) {
      console.log('Updated Ad:', this.adForm.value); // Log the updated ad details
      console.log('Ad ID:', this.adId); // Log the ad ID being updated

      console.log('Ad ID:', this.adId); // Log the ad ID being updated

      const updatedAd: Ad = {

        ...this.adForm.value,
        id: this.adId, // Ensure the ad ID is included for the update
      };

      this.adService.updateAd(updatedAd).subscribe({
        next: () => {
          console.log('Ad updated successfully');
          this.router.navigate(['/ads']); // Navigate back to the ad list or dashboard
        },
        error: (err) => {
          console.error('Error updating ad', err);
          alert('Failed to update advertisement.');
        }
      });
    }
  }
}
