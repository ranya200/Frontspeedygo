import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalarySettingsControllerService } from 'src/app/openapi'; 

@Component({
  selector: 'app-salary-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './salary-settings.component.html',
  styleUrls: ['./salary-settings.component.css']
})
export class SalarySettingsComponent implements OnInit {
  salaryForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  showSalarySettings = false; // Controls visibility of salary settings update section

  constructor(
    private fb: FormBuilder,
    private salarySettingsService: SalarySettingsControllerService
  ) {}

  ngOnInit(): void {
    this.salaryForm = this.fb.group({
      dailySalary: [100, [Validators.required, Validators.min(1)]],
      monthlySalary: [1000, [Validators.required, Validators.min(1)]]
    });
    this.loadSettings();
  }

  loadSettings(): void {
    this.salarySettingsService.getSettings().subscribe({
      next: async (res: any) => {
        const settings = res instanceof Blob ? JSON.parse(await res.text()) : res;
        this.salaryForm.patchValue({ 
          dailySalary: settings.dailySalary, 
          monthlySalary: settings.monthlySalary 
        });
      },
      error: () => this.errorMessage = 'Failed to load salary settings'
    });    
  }

  updateSettings(): void {
    const updatedValues = this.salaryForm.value;
    const payload = {
      dailySalary: updatedValues.dailySalary,
      monthlySalary: updatedValues.monthlySalary
    };
  
    this.salarySettingsService.updateSettings(payload).subscribe({
      next: () => this.successMessage = 'Salary settings updated successfully!',
      error: () => this.errorMessage = 'Failed to update salary settings.'
    });
  }  
  
  toggleSalarySettings(): void {
    this.showSalarySettings = !this.showSalarySettings;
  }
}
