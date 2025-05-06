import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from 'src/app/services/booking/booking.service';
import { Booking } from 'src/app/models/booking.model';
import { AuthService } from 'src/app/services/auth.service';
import { HeaderFrontComponent } from '../header-front/header-front.component';
import { FooterFrontComponent } from '../footer-front/footer-front.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, HeaderFrontComponent, FooterFrontComponent],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  currentUserId: string | null = null;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserIdFromToken();
    if (this.currentUserId) {
      this.bookingService.getBookingsForUser(this.currentUserId).subscribe({
        next: (data) => (this.bookings = data),
        error: (err) => console.error('❌ Failed to load bookings:', err)
      });
    }
  }

  cancelBooking(id: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(id).subscribe({
        next: () => {
          this.bookings = this.bookings.map(b =>
            b.id === id ? { ...b, status: 'CANCELED' } : b
          );
        },
        error: (err) => console.error('Error cancelling booking:', err)
      });
    }
  }
  
}
