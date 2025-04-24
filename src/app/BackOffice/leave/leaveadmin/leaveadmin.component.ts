import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Leave, LeaveControllerService, LeaveSettings, LeaveSettingsControllerService } from 'src/app/openapi';
import { NavbarBackComponent } from "../../navbar-back/navbar-back.component";
import { SidebarBackComponent } from "../../sidebar-back/sidebar-back.component";
import { FooterBackComponent } from "../../footer-back/footer-back.component";

@Component({
  selector: 'app-leaveadmin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarBackComponent, SidebarBackComponent, FooterBackComponent],
  templateUrl: './leaveadmin.component.html',
  styleUrl: './leaveadmin.component.css'
})
export class LeaveadminComponent implements OnInit{

    leaves: Leave[] = []; // Store all leaves
    settingsForm!: FormGroup;
    currentSettings!: LeaveSettings;
    leaveSet: LeaveSettings[] = [];

  
    constructor(private fb: FormBuilder, private leaveService: LeaveControllerService,private leaveSettingsService: LeaveSettingsControllerService, private router: Router) { }
    ngOnInit(): void {
      this.settingsForm = this.fb.group({
        maxAllowedDays: [10, [Validators.required, Validators.min(1)]]
          
      });
      
      this.getAllLeaves();
      this.fetchSettings();

  
      }

      fetchSettings(): void {
        this.leaveSettingsService.getSettings().subscribe({
          next: async (response) => {
            if (response instanceof Blob) {
              const text = await response.text(); // 🔁 Convertir le Blob en texte
              const settings = JSON.parse(text);  // 📦 Convertir en JSON
              this.currentSettings = settings;
              this.settingsForm.patchValue({ maxAllowedDays: settings.maxAllowedDays });
            } else {
              this.currentSettings = response;
              this.settingsForm.patchValue({ maxAllowedDays: response.maxAllowedDays });
            }
          },
          error: (err) => console.error('Erreur lors du chargement des paramètres', err)
        });
      }
      
      


      updateSettings(): void {
        const updatedMaxDays = this.settingsForm.value.maxAllowedDays;

        this.leaveSettingsService.updateMaxAllowedDays(updatedMaxDays).subscribe({
          next: () => alert('Leave settings updated successfully!'),
          error: (err) => console.error('Error updating settings', err)
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

    approveLeave(leave: Leave): void {
      if (confirm("Voulez-vous approuver cette demande de congé ?")) {
        this.leaveService.approveLeave(leave.id!).subscribe({
          next: () => {
            alert("La demande de congé a été approuvée !");
            this.getAllLeaves(); // Refresh the list
          },
          error: (err) => console.error("Erreur lors de l'approbation", err)
        });
      }
    }
    
    rejectLeave(leave: Leave): void {
      if (confirm("Voulez-vous rejeter cette demande de congé ?")) {
        this.leaveService.rejectLeave(leave.id!).subscribe({
          next: () => {
            alert("La demande de congé a été rejetée !");
            this.getAllLeaves(); // Refresh the list
          },
          error: (err) => console.error("Erreur lors du rejet", err)
        });
      }
    }
    
}
