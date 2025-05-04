import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PayrollControllerService, Payroll } from 'src/app/openapi';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payroll-list.component.html',
  styleUrls: ['./payroll-list.component.css']
})
export class PayrollListComponent implements OnInit {
  payrolls: Payroll[] = [];
  drivers: any[] = [];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  salaryCuts: { [month: string]: { [driverId: string]: number } } = {}; // salary cuts grouped by month and driver
  errorMessage = '';

  constructor(private payrollService: PayrollControllerService) {}

  ngOnInit(): void {
    this.fetchPayrolls();
  }

  fetchPayrolls(): void {
    this.payrollService.getAllPayrolls().subscribe({
      next: async (res: any) => {
        // Check if the response is a Blob and handle it accordingly
        if (res instanceof Blob) {
          // Convert Blob to text (JSON)
          const text = await res.text();
          try {
            const jsonResponse = JSON.parse(text); // Try to parse the text as JSON
            if (Array.isArray(jsonResponse)) {
              this.payrolls = jsonResponse;
              this.processSalaryCuts();
            } else {
              console.error('Expected an array, but received:', jsonResponse);
              this.errorMessage = 'Failed to load payroll records (invalid data format)';
            }
          } catch (e) {
            console.error('Error parsing Blob data:', e);
            this.errorMessage = 'Failed to parse payroll data.';
          }
        } else if (Array.isArray(res)) {
          // Handle case where the response is already an array
          this.payrolls = res;
          this.processSalaryCuts();
        } else {
          console.error('Expected an array or Blob, but received:', res);
          this.errorMessage = 'Failed to load payroll records (unexpected data format)';
        }
      },
      error: () => this.errorMessage = 'Failed to load payroll records'
    });
  }

  processSalaryCuts(): void {
    // Group payroll data by driver and month
    this.payrolls.forEach(payroll => {
      if (payroll.dateRecorded && payroll.salaryCut !== undefined) { // Ensure salaryCut is not undefined
        const dateRecorded = new Date(payroll.dateRecorded);
        const month = this.months[dateRecorded.getMonth()]; // Extract the month (0 = January, 1 = February, etc.)
        const driverId = payroll.driverId;
        const driverName = `${payroll.driverFirstName} ${payroll.driverLastName}`;

        // Add driver to the list if not already present
        if (!this.drivers.some(driver => driver.id === driverId)) {
          this.drivers.push({ id: driverId, name: driverName });
        }

        // Initialize the month and driver if not already present
        if (!this.salaryCuts[month]) {
          this.salaryCuts[month] = {};  // Initialize the month if it's not already present
        }

        if (!this.salaryCuts[month][driverId!]) {
          this.salaryCuts[month][driverId!] = 0;  // Initialize the driver entry for this month
        }

        // Add the salary cut for this month and driver
        this.salaryCuts[month][driverId!] += payroll.salaryCut; // Perform the addition safely
      }
    });
  }
}
