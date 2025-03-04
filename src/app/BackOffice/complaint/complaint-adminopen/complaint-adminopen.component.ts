import { Component, OnInit } from '@angular/core';
import { Complaint, ComplaintControllerService } from 'src/app/openapi';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarBackComponent } from "../../navbar-back/navbar-back.component";
import { SidebarBackComponent } from "../../sidebar-back/sidebar-back.component";
import { FooterBackComponent } from "../../footer-back/footer-back.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complaint-adminopen',
  standalone: true,
  imports: [NavbarBackComponent, SidebarBackComponent, FooterBackComponent, RouterLink, CommonModule],
  templateUrl: './complaint-adminopen.component.html',
  styleUrl: './complaint-adminopen.component.css'
})
export class ComplaintAdminopenComponent implements OnInit {

  complaint!: Complaint;
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

  deleteComplaint(id: string): void {
    if (confirm("Are you sure you want to delete this complaint?")) {
      this.complaintService.deleteComplaint(id).subscribe({
        next: () => {
          alert("Complaint deleted successfully!");
          this.router.navigate(['/admin/complaints']);
        },
        error: (err) => console.error("Error deleting complaint", err)
      });
    }
  }

  openComplaint(id: string): void {
    if (confirm("Mark this complaint as Open?")) {
      this.complaintService.opencomplaint(id).subscribe({
        next: () => {
          alert("Complaint marked as Open!");
          this.loadComplaintDetails();
        },
        error: (err) => console.error("Error opening complaint", err)
      });
    }
  }

  treatComplaint(id: string): void {
    if (confirm("Mark this complaint as Treated?")) {
      this.complaintService.treatecomplaint(id).subscribe({
        next: () => {
          alert("Complaint marked as Treated!");
          this.loadComplaintDetails();
        },
        error: (err) => console.error("Error treating complaint", err)
      });
    }
  }
}
