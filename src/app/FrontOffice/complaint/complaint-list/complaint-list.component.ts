import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Complaint, ComplaintControllerService } from 'src/app/openapi';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-complaint-list',
  standalone: true,
  imports: [CommonModule, FooterFrontComponent, HeaderFrontComponent, RouterLink],
  templateUrl: './complaint-list.component.html',
  styleUrl: './complaint-list.component.css'
})
export class ComplaintListComponent implements OnInit {
  complaints: Complaint[] = [];

  constructor(
    private complaintService: ComplaintControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllComplaints();
  }

  getAllComplaints(): void {
    this.complaintService.listComplaints().subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text();
          this.complaints = JSON.parse(text);
        } else {
          this.complaints = response;
        }
        console.log("Complaint data received:", this.complaints);
      },
      error: (err) => console.error("Error fetching complaints", err)
    });
  }

  deleteComplaint(id: string): void {
    if (confirm("Are you sure you want to delete this complaint?")) {
      this.complaintService.deleteComplaint(id).subscribe({
        next: () => {
          alert('Complaint deleted successfully!');
          this.getAllComplaints();
        },
        error: (err) => console.error("Error during deletion", err)
      });
    }
  }

  // ✅ Navigate to Complaint Details Page
  viewComplaint(id: string): void {
    this.router.navigate(['/complaintdetails', id]); // Redirect to complaint details
  }

  editComplaint(id: string): void {
    this.router.navigate(['/complaintedit', id]); // Redirect to edit page
  }
}
