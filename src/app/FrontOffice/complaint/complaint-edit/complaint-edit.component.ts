import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Complaint, ComplaintControllerService } from 'src/app/openapi';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-complaint-edit',
  standalone: true,
  imports: [CommonModule, FooterFrontComponent, HeaderFrontComponent, ReactiveFormsModule],
  templateUrl: './complaint-edit.component.html',
  styleUrl: './complaint-edit.component.css'
})
export class ComplaintEditComponent implements OnInit {
  complaintForm!: FormGroup;
  complaintId!: string;

  constructor(
    private fb: FormBuilder, 
    private complaintService: ComplaintControllerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.complaintId = this.route.snapshot.paramMap.get('id')!; // Get ID from URL

    this.complaintForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      status: ['', Validators.required] 
    });

    this.loadComplaintData();
  }

  loadComplaintData(): void {
    this.complaintService.getComplaint(this.complaintId).subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convert Blob to text
          const complaint = JSON.parse(text); // Convert text to JSON
          this.complaintForm.patchValue(complaint); // Populate the form
        } else {
          this.complaintForm.patchValue(response); // Directly populate if already JSON
        }
        console.log("Complaint data received for modification:", response);
      },
      error: (err) => console.error('Error retrieving complaint data', err)
    });
  }

  updateComplaint(): void {
    if (this.complaintForm.valid) {
      const updatedComplaint: Complaint = {
        ...this.complaintForm.value,
        id: this.complaintId 
      };
      this.complaintService.updateComplaint(updatedComplaint).subscribe({
        next: () => {
          alert('Complaint updated successfully!');
          this.router.navigate(['/complaint']); 
        },
        error: (err) => console.error("Error updating complaint", err)
      });
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/complaint']);
  }
}
