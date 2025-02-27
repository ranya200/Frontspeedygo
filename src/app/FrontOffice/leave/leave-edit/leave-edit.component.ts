import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Leave, LeaveControllerService } from 'src/app/openapi';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leave-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent],  
  templateUrl: './leave-edit.component.html',
  styleUrl: './leave-edit.component.css'
})
export class LeaveEditComponent implements OnInit {
  leaveForm!: FormGroup;
  leaveId!: string; // Store the ID from the URL

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private leaveService: LeaveControllerService
  ) {}

  ngOnInit(): void {
    this.leaveId = this.route.snapshot.paramMap.get('id')!; // Get ID from URL

    // Initialize form
    this.leaveForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]],
      status: ['PENDING', Validators.required]
    });

    // Load leave data
    this.loadLeaveData();
  }

  loadLeaveData(): void {
    this.leaveService.getLeave(this.leaveId).subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convert Blob to text
          const leave = JSON.parse(text); // Convert text to JSON
          this.leaveForm.patchValue(leave); // Populate the form
        } else {
          this.leaveForm.patchValue(response); // Directly populate if already JSON
        }
        console.log("Données reçues pour modification :", response);
      },
      error: (err) => console.error('Erreur lors de la récupération du congé', err)
    });
  }
  

  updateLeave(): void {
    if (this.leaveForm.valid) {
      const updatedLeave: Leave = {
        ...this.leaveForm.value,
        id: this.leaveId // Ensure the ID is included
      };

      this.leaveService.updateLeave(updatedLeave).subscribe({
        next: () => {
          alert('Demande de congé mise à jour avec succès !');
          this.router.navigate(['/leave']); // Redirect back to list page
        },
        error: (err) => console.error('Erreur lors de la mise à jour', err)
      });
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/leave']); // Navigate back to the list
  }
}