import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { Leave, LeaveControllerService } from 'src/app/openapi';

@Component({
  selector: 'app-leave-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent],
  templateUrl: './leave-add.component.html',
  styleUrl: './leave-add.component.css'
})
export class LeaveAddComponent implements OnInit {
  leaveForm!: FormGroup;
  leaves: Leave[] = []; // Store all leaves
  selectedLeave: Leave | null = null; // Stocke le congé en cours d'édition


  constructor(private fb: FormBuilder, private leaveService: LeaveControllerService) {}

  ngOnInit(): void {
    this.leaveForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]],
      status: ['PENDING', Validators.required] // Default to PENDING
    });
        // Fetch all leaves when component loads
    this.getAllLeaves();

  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      const leaveRequest: Leave = this.leaveForm.value;
      this.leaveService.addLeave(leaveRequest).subscribe({
        next: () => {alert('Demande de congé soumise avec succès !');
        this.getAllLeaves(); // Refresh leave list after submission
      },
        error: (err) => console.error('Erreur lors de la soumission', err)
      });
    }
  }

  deleteLeave(id: string): void {
    if (confirm("Voulez-vous vraiment supprimer cette demande de congé ?")) {
      this.leaveService.deleteLeave(id).subscribe({
        next: () => {
          alert('Demande de congé supprimée avec succès !');
          this.getAllLeaves(); // Rafraîchir la liste après suppression
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }
  

  getAllLeaves(): void {
    this.leaveService.getAllLeaves().subscribe({
      next: async (response) => {
        if (response instanceof Blob) {
          const text = await response.text(); // Convertir Blob en texte
          this.leaves = JSON.parse(text); // Convertir en JSON
        } else {
          this.leaves = response; // Déjà un tableau JSON
        }
        console.log("Données reçues :", this.leaves);
      },
      error: (err) => console.error('Erreur lors de la récupération des congés', err)
    });
  }

  editLeave(leave: Leave): void {
    this.selectedLeave = { ...leave }; // Cloner l'objet pour éviter les modifications directes
    this.leaveForm.patchValue(this.selectedLeave);
  }
  
  updateLeave(): void {
    if (this.leaveForm.valid && this.selectedLeave) {
      const updatedLeave: Leave = {
        ...this.selectedLeave,
        ...this.leaveForm.value
      };
  
      this.leaveService.updateLeave(updatedLeave).subscribe({
        next: () => {
          alert('Demande de congé mise à jour avec succès !');
          this.getAllLeaves(); // Rafraîchir la liste après mise à jour
          this.cancelEdit(); // Réinitialiser le formulaire après la mise à jour
        },
        error: (err) => console.error('Erreur lors de la mise à jour', err)
      });
    }
  }

  cancelEdit(): void {
    this.selectedLeave = null;
    this.leaveForm.reset();
  }
  
  
  
  
}
