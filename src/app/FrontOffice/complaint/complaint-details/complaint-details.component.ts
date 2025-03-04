import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Complaint, ComplaintControllerService } from 'src/app/openapi';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';

@Component({
  selector: 'app-complaint-details',
  standalone: true,
  imports: [CommonModule, FooterFrontComponent, HeaderFrontComponent],
  templateUrl: './complaint-details.component.html',
  styleUrl: './complaint-details.component.css'
})
export class ComplaintDetailsComponent implements OnInit {
  complaint: Complaint = { title: '', description: '', category: 'OTHER', status: 'PENDING' }; // ✅ Default values
  complaintId!: string;

  constructor(
    private complaintService: ComplaintControllerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.complaintId = this.route.snapshot.paramMap.get('id')!; // Get complaint ID from URL
    this.loadComplaintDetails();
  }

  loadComplaintDetails(): void {
    this.complaintService.getComplaint(this.complaintId).subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text();
          this.complaint = JSON.parse(text);
        } else {
          this.complaint = response;
        }
        console.log("Complaint details:", this.complaint);
      },
      error: (err) => console.error('Error retrieving complaint details', err)
    });
  }

  goBack(): void {
    this.router.navigate(['/complaint']);
  }
}
