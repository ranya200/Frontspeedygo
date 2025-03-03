import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad, AdControllerService } from 'src/app/openapi';
import { CommonModule } from '@angular/common';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';

@Component({
  selector: 'app-ad-details',
  standalone: true,
  imports: [CommonModule, FooterFrontComponent, HeaderFrontComponent],
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.css']
})
export class AdDetailsComponent implements OnInit {
  ad: Ad = { title: '', description: '', image: '', category: 'OTHER', startDate: '', endDate: '', status: '' };
  adId!: string;

  constructor(
    private adService: AdControllerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adId = this.route.snapshot.paramMap.get('id')!;
    if (!this.adId) {
      alert('Ad ID is missing');
      this.router.navigate(['/ads']);
      return;
    }
    this.loadAdDetails();
  }

  loadAdDetails(): void {
    this.adService.getAdById(this.adId).subscribe({
      next: (response) => {
        if (response instanceof Blob) {
          // Example: Convert Blob to text if expecting JSON encoded in Blob
          const reader = new FileReader();
          reader.onload = () => {
            this.ad = JSON.parse(reader.result as string);
          };
          reader.readAsText(response);
        } else {
          this.ad = response; // Assuming response is directly in JSON format
        }
        console.log("Ad details:", this.ad);
      },
      error: (err) => {
        console.error('Error retrieving ad details', err);
        alert('Failed to load ad details.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/ads']);
  }
}
