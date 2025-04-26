import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import {Leave, LeaveControllerService } from 'src/app/openapi';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-leave-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent, RouterModule],
  templateUrl: './leave-add.component.html',
  styleUrl: './leave-add.component.css'
})
export class LeaveAddComponent implements OnInit {
  leaveForm!: FormGroup;
  successMessage = '';
  errorMessage = '';  leaves: Leave[] = []; // Store all leaves
  driverId!: string;
  overLimitDays: number = 0;
  showConfirmation: boolean = false;
  pendingLeaveRequest!: Leave;


  constructor(private fb: FormBuilder, private leaveService: LeaveControllerService, private router: Router,private route: ActivatedRoute, ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.driverId = decoded.sub; // ✅ this is your Keycloak user ID
    }
  
    this.leaveForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    }, {
      validators: this.dateRangeValidator
    });
    
  }

  dateRangeValidator(form: FormGroup): { [key: string]: any } | null {
    const start = new Date(form.get('startDate')?.value);
    const end = new Date(form.get('endDate')?.value);
  
    if (start && end && start > end) {
      return { dateInvalid: true };
    }
    return null;
  }
  
  submitLeave(): void {
    if (this.leaveForm.invalid) return;
  
    const leaveRequest: Leave = {
      ...this.leaveForm.value,
      status: 'PENDING',
      driverId: this.driverId
    };
  
    this.leaveService.checkLeave(leaveRequest).subscribe({
      next: async (res: any) => {
        let parsed: any;
    
        if (res instanceof Blob) {
          const text = await res.text();
          try {
            parsed = JSON.parse(text);
          } catch (e) {
            console.error("❌ Erreur de parsing JSON :", text);
            this.errorMessage = "Erreur interne lors de la vérification.";
            return;
          }
        } else {
          parsed = res;
        }
    
        console.log("✅ Parsed response:", parsed);
    
        if (parsed.exceeds) {
          this.overLimitDays = parsed.exceededDays;
          this.pendingLeaveRequest = leaveRequest;
          this.showConfirmation = true;
          return;
        }
    
        // Si pas de dépassement → soumission directe
        this.leaveService.createLeave(leaveRequest).subscribe({
          next: () => {
            this.successMessage = 'Leave request submitted successfully!';
            this.leaveForm.reset();
            this.errorMessage = '';
          },
          error: async (error) => {
            this.errorMessage = "Erreur lors de la soumission.";
            console.error("🔴 Create error:", await error?.error?.text?.());
          }
        });
      },
      error: () => {
        this.errorMessage = "Impossible de vérifier les jours autorisés.";
      }
    });    
  }  
  
  confirmLeave(): void {
    this.leaveService.createLeave(this.pendingLeaveRequest).subscribe({
      next: () => {
        this.successMessage = 'Leave request submitted despite limit.';
        this.leaveForm.reset();
        this.showConfirmation = false;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Failed to confirm the leave request.';
      }
    });
  }  
  
}
