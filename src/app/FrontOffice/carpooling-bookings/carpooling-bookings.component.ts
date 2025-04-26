import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from 'src/app/services/booking/booking.service';
import { CarpoolingService } from 'src/app/services/carpooling/carpooling.service';
import { AuthService } from 'src/app/services/auth.service';
import { Booking } from 'src/app/models/booking.model';
import { HeaderFrontComponent } from '../header-front/header-front.component';
import { FooterFrontComponent } from '../footer-front/footer-front.component';
import { ActivatedRoute } from '@angular/router';


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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserIdFromToken();
    const rideId = this.route.snapshot.queryParamMap.get('rideId');
  
    if (rideId) {
      // afficher uniquement les bookings de ce trajet
      this.bookingService.getBookingsForRide(rideId).subscribe((bookings) => {
        this.bookings = bookings;
      });
    } else if (this.currentUserId) {
      this.loadBookings(); // cas général
    }
  }

  loadBookings() {
    this.bookingService.getBookingsByDriverId(this.currentUserId!).subscribe((data) => {
      console.log("📦 Bookings for your rides:", data);
      this.bookings = data;
    });
  }
  
  

  confirmBooking(bookingId: string) {
    this.bookingService.confirmBooking(bookingId).subscribe(() => {
      this.bookings = this.bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b
      );
      alert('✅ Booking confirmed!');
    });
  }
}
