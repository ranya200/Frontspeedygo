import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Complaint, ComplaintControllerService } from 'src/app/openapi';
import { NavbarBackComponent } from "../../navbar-back/navbar-back.component";
import { SidebarBackComponent } from "../../sidebar-back/sidebar-back.component";
import { FooterBackComponent } from "../../footer-back/footer-back.component";

@Component({
  selector: 'app-complaint-admin',
  standalone: true,
  imports: [CommonModule, NavbarBackComponent, SidebarBackComponent, FooterBackComponent],
  templateUrl: './complaint-admin.component.html',
  styleUrl: './complaint-admin.component.css'
})
export class ComplaintAdminComponent implements OnInit {
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
      next: (response) => {
        if (response instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            this.complaints = JSON.parse(reader.result as string);
          };
          reader.readAsText(response);
        } else {
          this.complaints = response;
        }
      },
      error: (err) => console.error("Error fetching complaints", err)
    });
  }


  openComplaint(id: string): void {
    const complaint = this.complaints.find(c => c.id === id); // Find the complaint by ID
  
    if (!complaint) {
      console.error("Complaint not found!");
      return;
    }
  
    if (complaint.status === "PENDING") {
      if (confirm("Do you want to mark this complaint as OPENED?")) {
        this.complaintService.opencomplaint(id).subscribe({
          next: () => {
            alert("Complaint status updated to OPENED.");
            this.router.navigate(['/admin/complaint', id]); // Redirect to details page
          },
          error: (err) => console.error("Error opening complaint", err)
        });
      }
    } else {
      this.router.navigate(['/admin/complaint', id]); // Redirect to details page
    }
  }
  

  treatComplaint(id: string): void {
    if (confirm("Do you want to mark this complaint as TREATED?")) {
      this.complaintService.treatecomplaint(id).subscribe({
        next: () => {
          alert("Complaint status updated to TREATED.");
          this.getAllComplaints();
        },
        error: (err) => console.error("Error treating complaint", err)
      });
    }
  }

  deleteComplaint(id: string): void {
    if (confirm("Are you sure you want to delete this complaint?")) {
      this.complaintService.deleteComplaint(id).subscribe({
        next: () => {
          alert("Complaint deleted successfully!");
          this.getAllComplaints();
        },
        error: (err) => console.error("Error during deletion", err)
      });
    }
  }
}
