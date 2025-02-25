import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Ad, AdControllerService } from 'src/app/openapi';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ad-list',
  imports: [CommonModule, ReactiveFormsModule, FooterFrontComponent, HeaderFrontComponent, RouterModule],
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.css']
})
export class AdListComponent implements OnInit {
  allowEdit = true;
  ads: Ad[] = []; // Array to hold the advertisements

  constructor(private adService: AdControllerService) {}

  ngOnInit(): void {
    this.loadAds();
  }

  // Method to fetch all ads
  loadAds(): void {
    this.adService.getAllAds().subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convert Blob to text
          this.ads = JSON.parse(text); // Convert text to JSON
        } else {
          this.ads = response; // Already a JSON array
        }
        console.log("Data received:", this.ads);
      },
      error: (err) => console.error('Error fetching ads', err)
    });
  }

  // Method to delete an ad
  deleteAd(adId: string): void {
    this.adService.deleteAd1(adId).subscribe({
      next: () => {
        this.ads = this.ads.filter(ad => ad.id !== adId); // Update the list by removing the deleted ad
        console.log('Ad successfully deleted');
      },
      error: (err) => console.error('Error deleting ad', err)
    });
  }
}
