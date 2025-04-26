import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveSettingsControllerService } from 'src/app/openapi';

@Component({
  selector: 'app-leave-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './leave-settings.component.html',
  styleUrls: ['./leave-settings.component.css']
})
export class LeaveSettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private leaveSettingsService: LeaveSettingsControllerService
  ) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      maxAllowedDays: [10, [Validators.required, Validators.min(1)]]
    });

    this.loadSettings();
  }

  loadSettings(): void {
    this.leaveSettingsService.getSettings().subscribe({
      next: async (res: any) => {
        const settings = res instanceof Blob ? JSON.parse(await res.text()) : res;
        this.settingsForm.patchValue({ maxAllowedDays: settings.maxAllowedDays });
      },
      error: () => this.errorMessage = 'Failed to load leave settings'
    });
  }

  updateSettings(): void {
    const updatedDays = this.settingsForm.value.maxAllowedDays;
    const payload = { maxAllowedDays: updatedDays };

    this.leaveSettingsService.updateSettings(payload).subscribe({
      next: () => this.successMessage = 'Leave settings updated successfully!',
      error: () => this.errorMessage = 'Failed to update leave settings.'
    });
  }
}
