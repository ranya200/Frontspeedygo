import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ad, AdControllerService } from 'src/app/openapi';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-ad',
  standalone: true,
  imports: [CommonModule, FooterFrontComponent, HeaderFrontComponent, ReactiveFormsModule],
  templateUrl: './ad-edit.component.html',
  styleUrls: ['./ad-edit.component.css']
})
export class EditAdComponent implements OnInit {
  adForm!: FormGroup;
  adId!: string;

  constructor(
    private fb: FormBuilder, 
    private adService: AdControllerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.adId = this.route.snapshot.paramMap.get('id')!; // Get ID from URL

    this.adForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: [''],
      category: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['']
    });

    this.loadAdData();
  }

  loadAdData(): void {
    this.adService.getAdById(this.adId).subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convert Blob to text
          const complaint = JSON.parse(text); // Convert text to JSON
          this.adForm.patchValue(complaint); // Populate the form
        } else {
          this.adForm.patchValue(response); // Directly populate if already JSON
        }
        console.log("Complaint data received for modification:", response);
      },
      error: (err) => console.error('Error retrieving complaint data', err)
    });
  }

  updateAd(): void {
    if (this.adForm.valid) {
      const updatedAd: Ad = {
        ...this.adForm.value,
        id: this.adId  // Include the ad ID for the backend to identify the record
      };
      this.adService.updateAd(updatedAd).subscribe({
        next: () => {
          alert('Ad updated successfully!');
          this.router.navigate(['/ads']); // Navigate back to the ad listing
        },
        error: (err) => {
          console.error("Error updating ad", err);
          alert('Failed to update ad.');
        }
      });
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/ads']); // Navigation on cancel
  }
}
