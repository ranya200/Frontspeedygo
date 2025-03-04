import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Ad, AdControllerService } from 'src/app/openapi';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-ad-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FooterFrontComponent, HeaderFrontComponent, RouterModule],
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.css']
})
export class AdListComponent implements OnInit {
  ads: Ad[] = []; // Array to hold the advertisements
  categories = Object.values(Ad.CategoryEnum);
  errorMessage: string = '';


  constructor(
    private adService: AdControllerService,
    public router: Router  // Ensure Router is properly injected
  ) {}

  ngOnInit(): void {
    this.loadAds();
  }


  loadAds(): void {
    this.adService.getAllAds().subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convertir Blob en texte
          this.ads = JSON.parse(text); // Convertir en JSON
        } else {
          this.ads = response; // Déjà un tableau JSON
        }
        console.log("Données reçues :", this.ads);
      },
      error: (err) => console.error('Erreur lors de la récupération des congés', err)
    });
  }

  deleteAd(adId: string): void {
    if (confirm('Are you sure you want to delete this ad?')) {
      this.adService.deleteAd1(adId).subscribe({
        next: () => {
          this.ads = this.ads.filter(ad => ad.id !== adId); // Update the list by removing the deleted ad
          console.log('Ad successfully deleted');
        },
        error: (err) => console.error('Error deleting ad', err)
      });
    }
  }

  // Navigate to Ad Details Page
  goToAdDetails(adId: string): void {
    this.router.navigate(['/ad-details', adId]);
  }

  // Navigate to Edit Ad Page
  editAd(adId: string): void {
    this.router.navigate(['/editad', adId]);
  }
}
