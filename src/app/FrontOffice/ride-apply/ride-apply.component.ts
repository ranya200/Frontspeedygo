import { Component, OnInit } from '@angular/core';
import { RideRequestService } from 'src/app/services/riderequest/ride-request.service';
import { RideRequest } from 'src/app/models/ride-request.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HeaderFrontComponent } from '../header-front/header-front.component';
import { FooterFrontComponent } from '../footer-front/footer-front.component';





@Component({
  selector: 'app-ride-apply',
  templateUrl: './ride-apply.component.html',
  styleUrls: ['./ride-apply.component.css'],
  standalone: true,
  imports: [CommonModule,MatSnackBarModule,HeaderFrontComponent,FooterFrontComponent],
})
export class RideApplyComponent implements OnInit {
  rideRequests: RideRequest[] = [];
  driverId!: string | null;

  constructor(private rideService: RideRequestService, private auth: AuthService,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.driverId = this.auth.getUserIdFromToken();
    this.loadRequests();
  }

  loadRequests() {
    this.rideService.getAll().subscribe(data => {
      console.log('🚗 All ride requests:', data); //
      this.rideRequests = data.filter(
        r => (!r.status || r.status === 'PENDING') && r.passengerId !== this.driverId
      );
      
    });
  }

  apply(requestId: string) {
    if (!this.driverId) return;

    this.rideService.applyToRequest(requestId, this.driverId).subscribe({
      next: () => {
        this.snackBar.open('✅ You applied for this ride!', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-success'
        });
        this.loadRequests();
      },
      error: () => {
        this.snackBar.open('❌ Failed to apply.', 'Close', {
          duration: 3000,
          panelClass: 'snackbar-error'
        });
      }
    });
    
  }
}
