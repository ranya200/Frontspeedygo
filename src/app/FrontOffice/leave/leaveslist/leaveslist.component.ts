import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderFrontComponent } from '../../header-front/header-front.component';
import { FooterFrontComponent } from '../../footer-front/footer-front.component';
import { Leave, LeaveControllerService } from 'src/app/openapi';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-leaveslist',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderFrontComponent, FooterFrontComponent, RouterModule ],  
  templateUrl: './leaveslist.component.html',
  styleUrl: './leaveslist.component.css'
})
export class LeaveslistComponent implements OnInit{

  leaves: Leave[] = [];
  currentUserId!: string;
  errorMessage = '';
  successMessage='';
  totalDays: number = 0;

  constructor(private leaveService: LeaveControllerService, private router: Router) { }

  ngOnInit(): void {
    this.loadCurrentUserId();
    this.fetchLeavesForUser();
    this.loadTotalLeaveDays();
  }

  loadTotalLeaveDays(): void {
    this.leaveService.getTotalLeaveDays(this.currentUserId).subscribe({
      next: async (res) => {
        if (res && typeof res === 'object' && 'size' in res && 'type' in res) {
          const text = await (res as Blob).text();
          this.totalDays = parseInt(text, 10);
        } else {
          this.totalDays = res as number;
        }
      },
      error: (err) => console.error('Erreur chargement total jours', err)
    });
  }

  loadCurrentUserId(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.currentUserId = decoded.sub; // Assuming `sub` is the user ID (UUID)
    }
  }

  fetchLeavesForUser(): void {
    this.leaveService.getMyLeaves(this.currentUserId).subscribe({
      next: (res: Leave[] | Blob) => {
        if (res instanceof Blob) {
          res.text().then(text => this.leaves = JSON.parse(text));
        } else {
          this.leaves = res;
        }
      },
      error: (err) => {
        console.error('Erreur récupération des congés', err);
        this.errorMessage = 'Erreur de chargement des congés';
      }
    });
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
    if (confirm('Are you sure you want to delete this leave request?')) {
      this.leaveService.deleteLeave(id).subscribe({
        next: () => {
          this.successMessage = 'Leave deleted successfully.';
          this.fetchLeavesForUser(); // Refresh list
        },
        error: err => {
          console.error('Error deleting leave:', err);
          this.errorMessage = 'Could not delete leave. It may already be approved or rejected.';
        }
      });
    }
  }
    
  editLeave(id: string): void {
    this.router.navigate(['/leaveedit', id]); // Redirect to edit page with leave ID
  }

}
