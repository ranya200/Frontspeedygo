import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { Leave, LeaveControllerService } from 'src/app/openapi';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-leave-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent, RouterModule],
  templateUrl: './leave-add.component.html',
  styleUrl: './leave-add.component.css'
})
export class LeaveAddComponent implements OnInit {
  leaveForm!: FormGroup;
  leaves: Leave[] = []; // Store all leaves


  constructor(private fb: FormBuilder, private leaveService: LeaveControllerService, private router: Router) { }

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]],
      status: ['PENDING', Validators.required] // Default to PENDING
    });
        // Fetch all leaves when component loads

  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      const leaveRequest: Leave = this.leaveForm.value;
      this.leaveService.addLeave(leaveRequest).subscribe({
        next: () => {alert('Demande de congé soumise avec succès !');
        this.router.navigate(['/leave']); // Redirect back to list page
      },
        error: (err) => console.error('Erreur lors de la soumission', err)
      });
    }
  }


  

 
 
  
  
  
  
}
