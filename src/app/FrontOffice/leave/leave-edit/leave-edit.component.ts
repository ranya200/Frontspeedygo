import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Leave, LeaveControllerService } from 'src/app/openapi';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-leave-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent, RouterModule],  
  templateUrl: './leave-edit.component.html',
  styleUrl: './leave-edit.component.css'
})
export class LeaveEditComponent implements OnInit {
  leaveForm!: FormGroup;
  leaveId!: string;
  errorMessage = '';
  successMessage = '';
  originalLeave?: Leave;
  overLimitDays: number = 0;
  showConfirmation: boolean = false;
  pendingUpdatedLeave!: Leave;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private leaveService: LeaveControllerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.leaveId = this.route.snapshot.paramMap.get('id')!;
    this.leaveService.getLeaveById(this.leaveId).subscribe({
      next: async (res) => {
        let leave: Leave;
        if (res instanceof Blob) {
          const text = await res.text();
          leave = JSON.parse(text);
        } else {
          leave = res;
        }

        if (leave.status !== 'PENDING') {
          this.errorMessage = 'Only pending requests can be edited.';
          return;
        }

        this.originalLeave = leave;
        this.leaveForm = this.fb.group({
          startDate: [leave.startDate, Validators.required],
          endDate: [leave.endDate, Validators.required],
          reason: [leave.reason, [Validators.required, Validators.minLength(5)]]
        }, { validators: this.dateRangeValidator });
      },
      error: () => this.errorMessage = 'Leave not found or server error.'
    });
  }

  dateRangeValidator(form: FormGroup) {
    const start = new Date(form.get('startDate')?.value);
    const end = new Date(form.get('endDate')?.value);
    return start && end && start > end ? { dateInvalid: true } : null;
  }

  onSubmit(): void {
    if (!this.leaveForm.valid || !this.originalLeave) return;
  
    const updatedLeave: Leave = {
      ...this.originalLeave,
      ...this.leaveForm.value
    };
  
    console.log("📤 Form submission:", updatedLeave);
  
    this.leaveService.checkLeave(updatedLeave).subscribe({
      next: async (res: any) => {
        if (res instanceof Blob) {
          const text = await res.text();
          res = JSON.parse(text);
        }
  
        console.log("✅ Résultat de checkLeave (frontend) :", res);
  
        if (res.exceeds) {
          console.log("🚨 Dépassement détecté :", res.exceededDays, "jours dépassés");
          this.overLimitDays = res.exceededDays;
          this.pendingUpdatedLeave = updatedLeave;
          this.showConfirmation = true;
          return;
        }
  
        console.log("✅ Aucun dépassement, on soumet la demande normalement");
        this.finalizeEdit(updatedLeave, false);
      },
      error: (err) => {
        console.error("❌ Erreur lors de checkLeave:", err);
        this.errorMessage = "Erreur lors de la vérification des jours.";
      }
    });
  }  

  finalizeEdit(leave: Leave, allowExceeding: boolean): void {
    console.log("📨 Envoi de la demande de mise à jour (allowExceeding =", allowExceeding, "):", leave);
  
    this.leaveService.confirmUpdate(this.leaveId, leave).subscribe({
      next: () => {
        console.log("✅ Mise à jour confirmée !");
        this.successMessage = 'Leave request updated successfully!';
        this.showConfirmation = false;
        setTimeout(() => this.router.navigate(['/leave']), 1500);
      },
      error: (err) => {
        console.error("❌ Échec de la mise à jour :", err);
        this.errorMessage = 'Échec de la mise à jour.';
      }
    });
  }  

  confirmEdit(): void {
    this.finalizeEdit(this.pendingUpdatedLeave, true);
  }
}
