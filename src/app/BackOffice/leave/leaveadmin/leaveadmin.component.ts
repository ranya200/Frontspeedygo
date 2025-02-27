import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FooterFrontComponent } from 'src/app/FrontOffice/footer-front/footer-front.component';
import { HeaderFrontComponent } from 'src/app/FrontOffice/header-front/header-front.component';
import { Leave, LeaveControllerService } from 'src/app/openapi';

@Component({
  selector: 'app-leaveadmin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent, RouterModule ],
  templateUrl: './leaveadmin.component.html',
  styleUrl: './leaveadmin.component.css'
})
export class LeaveadminComponent implements OnInit{

    leaves: Leave[] = []; // Store all leaves
  
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

    // ✅ Approve Leave Request
  approveLeave(leave: Leave): void {
    if (confirm("Voulez-vous approuver cette demande de congé ?")) {
      const updatedLeave: Leave = { ...leave, status: 'APPROVED' };

      this.leaveService.updateLeave(updatedLeave).subscribe({
        next: () => {
          alert("La demande de congé a été approuvée !");
          this.getAllLeaves(); // Refresh the list
        },
        error: (err) => console.error("Erreur lors de l'approbation", err)
      });
    }
  }

  // ❌ Reject Leave Request
  rejectLeave(leave: Leave): void {
    if (confirm("Voulez-vous rejeter cette demande de congé ?")) {
      const updatedLeave: Leave = { ...leave, status: 'REJECTED' };

      this.leaveService.updateLeave(updatedLeave).subscribe({
        next: () => {
          alert("La demande de congé a été rejetée !");
          this.getAllLeaves(); // Refresh the list
        },
        error: (err) => console.error("Erreur lors du rejet", err)
      });
    }
  }
}
