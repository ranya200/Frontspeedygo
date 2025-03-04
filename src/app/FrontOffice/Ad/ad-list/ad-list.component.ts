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
  allowEdit = true;
  ads: Ad[] = []; // Array to hold the advertisements

  constructor(
    private adService: AdControllerService,
    private router: Router  // Ensure Router is properly injected
  ) {}

  ngOnInit(): void {
    this.loadAds();
  }

  // Method to fetch all ads
  loadAds(): void {
    this.adService.getAllAds().subscribe({
      next: (ads: Ad[]) => {
        this.ads = ads; // Directly assigning the data assuming it's an array of Ad
        console.log("Data received:", this.ads);
      },
      error: (err) => console.error('Error fetching ads', err)
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
