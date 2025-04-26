// ✅ FINAL VERSION of CarpoolingComponent (ride-specific + global rating fallback)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { CarpoolingService } from 'src/app/services/carpooling/carpooling.service';
import { HeaderFrontComponent } from '../header-front/header-front.component';
import { FooterFrontComponent } from '../footer-front/footer-front.component';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking/booking.service';
import { RatingService } from 'src/app/services/rating/rating.service';
import { Booking } from 'src/app/models/booking.model';
import { Carpool } from 'src/app/models/carpool.model';
import { RideRating } from 'src/app/models/ride-rating.model';
import { RideRatingFormComponent } from '../ride-rating-form/ride-rating-form.component';
import { RideRatingsListComponent } from '../ride-ratings-list/ride-ratings-list.component';

@Component({
  selector: 'app-carpooling',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderFrontComponent,
    FooterFrontComponent,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    RideRatingFormComponent,
    RideRatingsListComponent
  ],
  templateUrl: './carpooling.component.html',
  styleUrls: ['./carpooling.component.css']
})
export class CarpoolingComponent implements OnInit {
  carpoolingList: Carpool[] = [];
  filteredRides: Carpool[] = [];
  currentUserId: string | null = null;
  showMyRidesOnly = false;
  selectedCarpool: Carpool | null = null;
  showSuggestRideModal: boolean = false;
  seatsToBook: { [rideId: string]: number } = {};
  isDrawerOpen = false;
  myBookedRideIds: string[] = [];
  confirmedRides: string[] = [];
  averageRatings: { [rideId: string]: number } = {};
  rideBadges: { [rideId: string]: string } = {};
  driverGlobalBadges: { [driverId: string]: string } = {}; // NEW
  showRatings: { [rideId: string]: boolean } = {};
  showRatingForm: { [rideId: string]: boolean } = {};

  newCarpool: Carpool = {
    driverId: '',
    driverName: '',
    pickupLocation: '',
    dropoffLocation: '',
    departureTime: '',
    availableSeats: 0,
    pricePerSeat: 0,
    typeservice: 'Carpooling'
  };

  constructor(
    private carpoolingService: CarpoolingService,
    private authService: AuthService,
    private bookingService: BookingService,
    private ratingService: RatingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserIdFromToken();
    this.loadCarpooling();
    this.fetchConfirmedBookings();
    this.loadGlobalBadges(); // NEW
    this.loadDriverRatings(); // ratings spécifiques au ride
    
  }

  fetchConfirmedBookings(): void {
    if (!this.currentUserId) return;
    this.bookingService.getBookingsForUser(this.currentUserId).subscribe(bookings => {
      this.myBookedRideIds = bookings.map(b => b.rideId);
      this.confirmedRides = bookings.filter(b => b.status === 'CONFIRMED').map(b => b.rideId);
    });
  }

  loadGlobalBadges(): void {
    this.ratingService.getGlobalBadges().subscribe(res => {
      this.driverGlobalBadges = res;
    });
  }

  toggleRatingForm(rideId: string): void {
    this.showRatingForm[rideId] = !this.showRatingForm[rideId];
  }

  userHasBookedRide(rideId: string): boolean {
    return this.myBookedRideIds.includes(rideId);
  }

  toggleShowRatings(rideId: string): void {
    this.showRatings[rideId] = !this.showRatings[rideId];
  }

  loadDriverRatings(): void {
    this.carpoolingList.forEach(ride => {
      if (!ride.id) return;
      this.ratingService.getRatingsForRide(ride.id).subscribe(ratings => {
        const avg = ratings.reduce((sum, r) => sum + (r.safetyScore + r.punctualityScore + r.comfortScore) / 3, 0) / ratings.length;
        this.averageRatings[ride.id!] = avg;

        if (avg >= 4.5) this.rideBadges[ride.id!] = 'GOLD';
        else if (avg >= 4.0) this.rideBadges[ride.id!] = 'SILVER';
        else if (avg >= 3.0) this.rideBadges[ride.id!] = 'BRONZE';
        else this.rideBadges[ride.id!] = 'UNRATED';
      });
    });
  }

  loadMyRides() {
    if (!this.currentUserId) return;
    this.carpoolingService.getCarpoolingByDriverId(this.currentUserId).subscribe((data) => {
      this.filteredRides = data;
    });
  }

  loadCarpooling() {
    this.carpoolingService.getCarpooling().subscribe(
      (data) => {
        this.carpoolingList = data;
        this.applyRideFilter();
        this.loadDriverRatings();
      },
      (error) => {
        console.error('Error fetching carpooling data:', error);
      }
    );
  }

  applyRideFilter() {
    this.filteredRides = this.showMyRidesOnly
      ? this.carpoolingList.filter(c => c.driverId === this.currentUserId)
      : this.carpoolingList;
  }

  toggleRideView() {
    this.showMyRidesOnly = !this.showMyRidesOnly;
    this.applyRideFilter();
  }

  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  bookRide(rideId: string): void {
    if (!this.currentUserId) {
      alert('You must be logged in to book a ride!');
      return;
    }

    const ride = this.filteredRides.find(r => r.id === rideId);
    if (ride?.driverId === this.currentUserId) {
      alert('❌ You cannot book your own ride.');
      return;
    }

    const seats = this.seatsToBook[rideId] || 1;

    const newBooking: Booking = {
      rideId,
      passengerId: this.currentUserId,
      seatsBooked: seats,
      status: 'PENDING'
    };

    this.bookingService.createBooking(newBooking).subscribe({
      next: () => {
        alert(`✅ ${seats} seat(s) booked successfully!`);
        this.seatsToBook[rideId] = 1;
      },
      error: (err) => {
        console.error(err);
        alert('❌ Failed to book seat.');
      }
    });
  }

  submitCarpooling() {
    this.newCarpool.driverId = this.currentUserId!;
    this.carpoolingService.addCarpooling(this.newCarpool).subscribe(
      () => {
        alert('Carpooling added successfully!');
        this.loadCarpooling();
        this.resetForm();
        this.showSuggestRideModal = false;
      },
      () => alert('Failed to submit carpooling.')
    );
  }

  deleteCarpool(id?: string) {
    if (id && confirm('Are you sure you want to cancel this ride?')) {
      this.carpoolingService.deleteCarpooling(id).subscribe(
        () => {
          alert('Ride canceled successfully!');
          this.loadCarpooling();
        },
        () => alert('Failed to cancel the ride.')
      );
    }
  }

  selectCarpool(carpool: Carpool) {
    if (carpool.driverId === this.currentUserId) {
      this.router.navigate(['/carpooling-bookings'], {
        queryParams: { rideId: carpool.id }
      });
    }
  }

  updateCarpooling() {
    if (this.selectedCarpool?.id) {
      this.carpoolingService.updateCarpooling(this.selectedCarpool.id, this.selectedCarpool).subscribe(
        () => {
          alert('Carpooling updated successfully!');
          this.loadCarpooling();
          this.selectedCarpool = null;
        },
        () => alert('Failed to update carpooling.')
      );
    }
  }

  cancelUpdate() {
    this.selectedCarpool = null;
  }

  resetForm() {
    this.newCarpool = {
      driverId: '',
      driverName: '',
      pickupLocation: '',
      dropoffLocation: '',
      departureTime: '',
      availableSeats: 0,
      pricePerSeat: 0,
      typeservice: 'Carpooling'
    };
  }
}
