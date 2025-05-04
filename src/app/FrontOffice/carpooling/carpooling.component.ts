import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CarpoolingService } from 'src/app/services/carpooling/carpooling.service';
import { FavoriteService } from 'src/app/services/favorite/favorite.service';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking/booking.service';
import { RatingService } from 'src/app/services/rating/rating.service';
import { Carpool } from 'src/app/models/carpool.model';
import { Booking } from 'src/app/models/booking.model';
import { RideRating } from 'src/app/models/ride-rating.model';

import { HeaderFrontComponent } from '../header-front/header-front.component';
import { FooterFrontComponent } from '../footer-front/footer-front.component';
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
  driverGlobalBadges: { [driverId: string]: string } = {};
  showRatings: { [rideId: string]: boolean } = {};
  showRatingForm: { [rideId: string]: boolean } = {};
  currentUserName: string = '';
  searchQuery: string = '';
  favoriteRideIds: string[] = [];
  showFavoritesOnly: boolean = false;
  showEditForm: { [rideId: string]: boolean } = {};
  editRatingData: { [rideId: string]: RideRating } = {};
  showTodayOnly: boolean = false;
  editMode: { [key: string]: boolean } = {};

  canRateRide: { [rideId: string]: boolean } = {};

  showEditMessage: { [rideId: string]: boolean } = {};  // To show "edit message"
  submittedRatings: { [rideId: string]: boolean } = {};




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
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private bookingService: BookingService,
    private ratingService: RatingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserIdFromToken();
    this.currentUserName = this.authService.getUserNameFromToken() ?? '';
    this.loadCarpooling();
    this.fetchConfirmedBookings();
    this.loadGlobalBadges();
    this.loadDriverRatings();
    this.loadFavoritesFromBackend();
  }




  toggleTodayFilter(): void {
    this.showTodayOnly = !this.showTodayOnly;
    this.applyRideFilter();
  }

  loadFavoritesFromBackend(): void {
    if (!this.currentUserId) return;
    this.favoriteService.getFavorites(this.currentUserId).subscribe({
      next: (ids) => {
        this.favoriteRideIds = ids;
        this.applyRideFilter();
      },
      error: () => {
        console.error('❌ Failed to load favorites');
      }
    });
  }

  toggleFavorite(rideId: string): void {
    if (!this.currentUserId) return;

    const index = this.favoriteRideIds.indexOf(rideId);
    if (index > -1) {
      this.favoriteService.removeFavorite(this.currentUserId, rideId).subscribe({
        next: () => {
          this.favoriteRideIds.splice(index, 1);
          this.applyRideFilter();
        },
        error: () => {
          console.error('❌ Failed to remove favorite');
        }
      });
    } else {
      this.favoriteService.addFavorite(this.currentUserId, rideId).subscribe({
        next: () => {
          this.favoriteRideIds.push(rideId);
          this.applyRideFilter();
        },
        error: () => {
          console.error('❌ Failed to add favorite');
        }
      });
    }
  }

  isFavorite(rideId: string): boolean {
    return this.favoriteRideIds.includes(rideId);
  }

  onEditRatingClick(rideId: string): void {
    const passengerId = this.currentUserId!;
    this.ratingService.getUserRatingForRide(rideId, passengerId).subscribe((rating) => {
      this.editRatingData[rideId] = rating;
      this.showRatingForm[rideId] = true;
    });
  }

  toggleEditForm(id: string): void {
    this.showEditForm[id] = !this.showEditForm[id];
  }

  updateCarpooling(carpool: Carpool): void {
    if (carpool.id) {
      this.carpoolingService.updateCarpooling(carpool.id, carpool).subscribe({
        next: () => {
          this.showToast('✅ Carpool updated successfully!');
          this.loadCarpooling();
          this.showEditForm[carpool.id!] = false;
        },
        error: () => {
          this.showToast('❌ Failed to update carpool.', 'error');
        }
      });
    }
  }

  showToast(message: string, type: 'success' | 'error' = 'success', duration: number = 3000) {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
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

  loadCarpooling(): void {
    this.carpoolingService.getCarpooling().subscribe({
      next: (data) => {
        this.carpoolingList = data;
        this.applyRideFilter();
        this.loadDriverRatings();
      },
      error: (err) => {
        console.error('Error fetching carpooling data:', err);
      }
    });
  }

  applyRideFilter(): void {
    this.filteredRides = this.carpoolingList.filter(c => {
      const matchesDriver = !this.showMyRidesOnly || c.driverId === this.currentUserId;
      const matchesSearch = this.matchSearchQuery(c);
      const matchesFavorite = !this.showFavoritesOnly || this.isFavorite(c.id!);
      const matchesToday = !this.showTodayOnly || this.isRideToday(c.departureTime);
  
      return matchesDriver && matchesSearch && matchesFavorite && matchesToday;
    });
  }

  isRideToday(departureTime: string): boolean {
    const rideDate = new Date(departureTime);
    const today = new Date();
  
    return (
      rideDate.getDate() === today.getDate() &&
      rideDate.getMonth() === today.getMonth() &&
      rideDate.getFullYear() === today.getFullYear()
    );
  }

  toggleFavoritesFilter(): void {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    this.applyRideFilter();
  }

  matchSearchQuery(carpool: Carpool): boolean {
    if (!this.searchQuery) return true;
    const query = this.searchQuery.toLowerCase();
    return (
      carpool.pickupLocation?.toLowerCase().includes(query) ||
      carpool.dropoffLocation?.toLowerCase().includes(query)
    );
  }

  toggleRideView(): void {
    this.showMyRidesOnly = !this.showMyRidesOnly;
    this.applyRideFilter();
  }

  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  bookRide(rideId: string): void {
    if (!this.currentUserId) {
      this.showToast('❌ You must be logged in to book a ride!', 'error');
      return;
    }

    const ride = this.filteredRides.find(r => r.id === rideId);
    if (ride?.driverId === this.currentUserId) {
      this.showToast('❌ You cannot book your own ride.', 'error');
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
        this.showToast(`✅ ${seats} seat(s) booked successfully!`);
        this.seatsToBook[rideId] = 1;
       
      },
      error: (err) => {
        console.error(err);
        this.showToast('❌ Failed to book seat.', 'error');
      }
    });
  }

  submitCarpooling(): void {
    this.newCarpool.driverId = this.currentUserId!;
    this.newCarpool.driverName = this.currentUserName!;
    this.carpoolingService.addCarpooling(this.newCarpool).subscribe({
      next: () => {
        this.showToast('✅ Carpooling added successfully!');
        this.loadCarpooling();
        this.resetForm();
        this.showSuggestRideModal = false;
      },
      error: () => {
        this.showToast('❌ Failed to submit carpooling.', 'error');
      }
    });
  }

  deleteCarpool(id?: string): void {
    if (id && confirm('Are you sure you want to cancel this ride?')) {
      this.carpoolingService.deleteCarpooling(id).subscribe({
        next: () => {
          this.showToast('✅ Ride canceled successfully!');
          this.loadCarpooling();
        },
        error: () => {
          this.showToast('❌ Failed to cancel the ride.', 'error');
        }
      });
    }
  }

  selectCarpool(carpool: Carpool): void {
    if (carpool.driverId === this.currentUserId) {
      this.router.navigate(['/carpooling-bookings'], {
        queryParams: { rideId: carpool.id }
      });
    }
  }

  resetForm(): void {
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
