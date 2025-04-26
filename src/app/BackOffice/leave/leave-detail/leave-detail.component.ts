import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Leave, LeaveControllerService, LeaveDTO } from 'src/app/openapi';
import { NavbarBackComponent } from '../../navbar-back/navbar-back.component';
import { SidebarBackComponent } from '../../sidebar-back/sidebar-back.component';
import { FooterBackComponent } from '../../footer-back/footer-back.component';

@Component({
  selector: 'app-leave-detail',
  standalone:true,
  imports:[CommonModule, NavbarBackComponent,
      SidebarBackComponent,
      FooterBackComponent,
    RouterLink,],
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.css']
})
export class LeaveDetailComponent implements OnInit {
  leaveId!: string;
  leave?: LeaveDTO;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private leaveService: LeaveControllerService
  ) {}

  ngOnInit(): void {
    this.leaveId = this.route.snapshot.paramMap.get('id')!;
    this.fetchLeaveDetails();
  }

  fetchLeaveDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id)
    this.leaveService.getLeaveDTOById(id).subscribe({
      next: async (res) => {
        if (res instanceof Blob) {
          const text = await res.text();
          this.leave = JSON.parse(text);
        } else {
          this.leave = res;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load leave details';
      }
    });
  }
}