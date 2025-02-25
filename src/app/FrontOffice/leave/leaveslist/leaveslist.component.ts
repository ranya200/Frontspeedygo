import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { Leave, LeaveControllerService } from 'src/app/openapi';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaveslist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent],  
  templateUrl: './leaveslist.component.html',
  styleUrl: './leaveslist.component.css'
})
export class LeaveslistComponent implements OnInit{

  leaveForm!: FormGroup;
  leaves: Leave[] = []; // Store all leaves
  selectedLeave: Leave | null = null; // Stocke le congé en cours d'édition

  constructor(private fb: FormBuilder, private leaveService: LeaveControllerService, private router: Router) { }
  ngOnInit(): void {
    this.getAllLeaves();

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

  editLeave(id: string): void {
    this.router.navigate(['/leaveedit', id]); // Redirect to edit page with leave ID
  }
  

  
  

}
