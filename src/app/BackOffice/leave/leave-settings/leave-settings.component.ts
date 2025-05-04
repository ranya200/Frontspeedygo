import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveSettingsControllerService } from 'src/app/openapi';  // OpenAPI service for leave settings
import { SalarySettingsControllerService } from 'src/app/openapi'; // OpenAPI service for salary settings

@Component({
  selector: 'app-leave-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './leave-settings.component.html',
  styleUrls: ['./leave-settings.component.css']
})
export class LeaveSettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  salaryForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  showSettings = false; // Control visibility of both settings forms

  constructor(
    private fb: FormBuilder,
    private leaveSettingsService: LeaveSettingsControllerService,
    private salarySettingsService: SalarySettingsControllerService
  ) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      maxAllowedDays: [10, [Validators.required, Validators.min(1)]]
    });

    this.salaryForm = this.fb.group({
      dailySalary: [100, [Validators.required, Validators.min(1)]],
      monthlySalary: [1000, [Validators.required, Validators.min(1)]]
    });

    this.loadSettings();
    this.loadSalarySettings();
  }

  loadSettings(): void {
    this.leaveSettingsService.getSettings1().subscribe({
      next: async (res: any) => {
        const settings = res instanceof Blob ? JSON.parse(await res.text()) : res;
        this.settingsForm.patchValue({
          maxAllowedDays: settings.maxAllowedDays
        });
      },
      error: () => this.errorMessage = 'Failed to load leave settings'
    });
  }

  loadSalarySettings(): void {
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

  // Save both Leave and Salary settings in one go
  saveAllSettings(): void {
    const leaveSettingsPayload = { maxAllowedDays: this.settingsForm.value.maxAllowedDays };
    const salarySettingsPayload = {
      dailySalary: this.salaryForm.value.dailySalary,
      monthlySalary: this.salaryForm.value.monthlySalary
    };

    // Save Leave Settings
    this.leaveSettingsService.updateSettings1(leaveSettingsPayload).subscribe({
      next: () => {
        // Save Salary Settings after leave settings are saved
        this.salarySettingsService.updateSettings(salarySettingsPayload).subscribe({
          next: () => {
            this.successMessage = 'All settings updated successfully!';
          },
          error: () => {
            this.errorMessage = 'Failed to update salary settings.';
          }
        });
      },
      error: () => this.errorMessage = 'Failed to update leave settings.'
    });
  }
}
