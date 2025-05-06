import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from 'src/app/services/booking/booking.service';
import { CarpoolingService } from 'src/app/services/carpooling/carpooling.service';
import { AuthService } from 'src/app/services/auth.service';
import { Booking } from 'src/app/models/booking.model';
import { HeaderFrontComponent } from '../header-front/header-front.component';
import { FooterFrontComponent } from '../footer-front/footer-front.component';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-carpooling-bookings',
  standalone: true,
  imports: [CommonModule, HeaderFrontComponent, FooterFrontComponent],
  templateUrl: './carpooling-bookings.component.html',
  styleUrls: ['./carpooling-bookings.component.css']
})
export class CarpoolingBookingsComponent implements OnInit {
  currentUserId: string | null = null;
  bookings: Booking[] = [];

  constructor(
    private bookingService: BookingService,
    private carpoolingService: CarpoolingService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar // for toast notifications
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserIdFromToken();
    const rideId = this.route.snapshot.queryParamMap.get('rideId');
  
    if (rideId) {
      // Show only bookings for this ride
      this.bookingService.getBookingsForRide(rideId).subscribe((bookings) => {
        this.bookings = bookings;
      });
    } else if (this.currentUserId) {
      this.loadBookings(); // General case: Show all bookings
    }
  }

  loadBookings() {
    this.bookingService.getBookingsByDriverId(this.currentUserId!).subscribe((data) => {
      console.log("📦 Bookings for your rides:", data);
      this.bookings = data;
    });
  }

  declineBooking(bookingId: string): void {
    this.bookingService.declineBooking(bookingId).subscribe({
      next: () => {
        this.loadBookings();
      },
      error: (err) => {
        console.error('Error declining booking:', err);
      }
    });
  }

  confirmBooking(bookingId: string) {
    this.bookingService.confirmBooking(bookingId).subscribe({
      next: () => {
        this.bookings = this.bookings.map(b =>
          b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b
        );
        alert('✅ Booking confirmed!');
      },
      error: (err) => {
        if (err.status === 400) {
          this.snackBar.open('🚫 No available seats for this booking.', 'Close', { duration: 3000 });
        } else {
          console.error('Error confirming booking:', err);
          this.snackBar.open('❌ Something went wrong. Please try again later.', 'Close', { duration: 3000 });
        }
      }
    });
  }
  
}
