import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Complaint, ComplaintControllerService } from 'src/app/openapi'; // Ensure path matches where you store your service and entity
import { FooterFrontComponent } from '../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../header-front/header-front.component';

@Component({
  selector: 'app-complaint',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FooterFrontComponent, HeaderFrontComponent],
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent implements OnInit {
  complaintForm!: FormGroup;
  complaints: Complaint[] = []; // Store all complaints
  selectedComplaint: Complaint | null = null; // Track the complaint being edited

  constructor(
    private fb: FormBuilder, 
    private complaintService: ComplaintControllerService // Assume you have a service like this
  ) {}

  ngOnInit(): void {
    this.complaintForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      category: [''],
      status: ['OPEN', Validators.required] // Default status is "OPEN"
    });

    this.getAllComplaints();
  }

  onSubmit(): void {
    if (this.complaintForm.valid) {
      const complaintRequest: Complaint = this.complaintForm.value;
      if (this.selectedComplaint) {
        this.updateComplaint(complaintRequest);
      } else {
        this.complaintService.createComplaint(complaintRequest).subscribe({
          next: () => {
            alert('Complaint submitted successfully!');
            this.getAllComplaints(); // Refresh complaints list after submission
            this.complaintForm.reset({ status: 'OPEN' }); // Reset form with default status
          },
          error: (err) => console.error('Error submitting complaint', err)
        });
      }
    }
  }

  deleteComplaint(id: string): void {
    if (confirm("Are you sure you want to delete this complaint?")) {
      this.complaintService.deleteComplaint(id).subscribe({
        next: () => {
          alert('Complaint deleted successfully!');
          this.getAllComplaints(); // Refresh the list after deletion
        },
        error: (err) => console.error("Error during deletion", err)
      });
    }
  }

  getAllComplaints(): void {
    this.complaintService.listComplaints().subscribe({
      next: (response) => {
        if (response instanceof Blob) {
          // Assuming the Blob contains JSON data
          const reader = new FileReader();
          reader.onload = () => {
            this.complaints = JSON.parse(reader.result as string);
            console.log("Complaint data received:", this.complaints);
          };
          reader.readAsText(response);
        } else {
          this.complaints = response; // Already a JSON array
        }
      },
      error: (err) => console.error("Error fetching complaints", err)
    });
  }
  

  editComplaint(complaint: Complaint): void {
    this.selectedComplaint = { ...complaint }; // Clone the object to avoid direct modification
    this.complaintForm.patchValue(this.selectedComplaint);
  }

  updateComplaint(complaint: Complaint): void {
    this.complaintService.updateComplaint({...this.selectedComplaint, ...complaint}).subscribe({
      next: () => {
        alert('Complaint updated successfully!');
        this.getAllComplaints(); // Refresh the list after update
        this.cancelEdit(); // Reset the form
      },
      error: (err) => console.error("Error updating complaint", err)
    });
  }

  cancelEdit(): void {
    this.selectedComplaint = null;
    this.complaintForm.reset({ status: 'OPEN' }); // Reset form with default status
  }
}
