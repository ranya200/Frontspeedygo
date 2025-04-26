import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LeaveControllerService, LeaveDTO } from 'src/app/openapi';

@Component({
  selector: 'app-leave-requests-list',
  standalone:true,
  imports:[CommonModule,RouterLink],
  templateUrl: './leave-requests-list.component.html',
  styleUrls: ['./leave-requests-list.component.css']
})
export class LeaveRequestsListComponent implements OnInit {

  leaves: LeaveDTO[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(private leaveService: LeaveControllerService) {}

  ngOnInit(): void {
    this.fetchAllLeaves();
  }

  fetchAllLeaves(): void {
    this.leaveService.getDetailedLeaves().subscribe({
      next: async (res: any) => {
        if (res instanceof Blob) {
          const text = await res.text();
          this.leaves = JSON.parse(text);
        } else {
          this.leaves = res;
        }
      },
      error: () => {
        this.errorMessage = '❌ Failed to load leave requests.';
      }
    });
  }

  getBadgeClass(status: string): string {
    return status === 'APPROVED' ? 'bg-success' :
           status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark';
  }

  approve(leaveId: string): void {
    if (confirm("✅ Approve this leave request?")) {
      this.leaveService.approveLeave(leaveId).subscribe({
        next: () => {
          this.successMessage = "Leave approved successfully!";
          this.fetchAllLeaves();
        },
        error: () => this.errorMessage = "❌ Failed to approve leave."
      });
    }
  }

  reject(leaveId: string): void {
    if (confirm("❌ Reject this leave request?")) {
      this.leaveService.rejectLeave(leaveId).subscribe({
        next: () => {
          this.successMessage = "Leave rejected successfully!";
          this.fetchAllLeaves();
        },
        error: () => this.errorMessage = "❌ Failed to reject leave."
      });
    }
  }

  viewDetails(leave: LeaveDTO): void {
    alert(
      `Leave Details:\nDriver: ${leave.driverFullName}\nStart: ${leave.startDate}\nEnd: ${leave.endDate}\nReason: ${leave.reason}\nStatus: ${leave.status}`
    );
  }

}
