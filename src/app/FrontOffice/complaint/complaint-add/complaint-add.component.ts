import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Complaint, ComplaintControllerService } from 'src/app/openapi';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { HeaderFrontComponent } from '../../header-front/header-front.component';

@Component({
  selector: 'app-complaint-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FooterFrontComponent, HeaderFrontComponent, RouterLink],
  templateUrl: './complaint-add.component.html',
  styleUrl: './complaint-add.component.css'
})
export class ComplaintAddComponent implements OnInit {
  complaintForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.complaintForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      status: ['PENDING', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.complaintForm.valid) {
      const newComplaint: Complaint = this.complaintForm.value;
      this.complaintService.createComplaint(newComplaint).subscribe({
        next: () => {
          alert('Complaint submitted successfully!');
          this.router.navigate(['/complaint']); // Redirect to complaint list
        },
        error: (err) => console.error('Error submitting complaint', err)
      });
    }
  }
}
