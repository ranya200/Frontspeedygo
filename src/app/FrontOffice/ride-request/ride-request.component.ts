import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { RideRequestService } from 'src/app/services/riderequest/ride-request.service';
import { AuthService } from 'src/app/services/auth.service';
import { RideRequest } from 'src/app/models/ride-request.model';
import { RideRequestWithNames } from 'src/app/models/ride-request-with-names.model';

import { HeaderFrontComponent } from '../header-front/header-front.component';
import { FooterFrontComponent } from '../footer-front/footer-front.component';
import { LocationMapDialogComponent } from '../location-map-dialog/location-map-dialog.component';
import { RideRouteMapDialogComponent } from '../ride-route-map-dialog/ride-route-map-dialog.component';


@Component({
  selector: 'app-ride-request',
  standalone: true,
  templateUrl: './ride-request.component.html',
  styleUrls: ['./ride-request.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    HeaderFrontComponent,
    FooterFrontComponent,
    LocationMapDialogComponent
  ]
})
export class RideRequestComponent implements OnInit {
  showCreateModal = false;
  isMapDialogOpen = false;
  showMatchedRides = false;

  

  showMyRequests: boolean = false;
  showEditModal = false;
  
  editedRequest: RideRequest = {
    passengerId: '',
    pickupLocation: '',
    dropoffLocation: '',
    preferredTime: '',
    seatsNeeded: 1
  };
  
  editRide(request: RideRequestWithNames): void {
    // Clone the selected request to prevent modifying the original data
    this.editedRequest = { ...request };
     // Set the current user as the passenger ID
  
    // Open the modal
    this.showCreateModal = true;
    this.showEditModal = true;
  }
  

  deleteRide(requestId: string): void {
   
    this.rideRequestService.deleteRide(requestId).subscribe(() => {
      this.snackBar.open('🗑️ Ride request deleted!', 'Close', { duration: 3000 });
      this.loadRequests();  // Reload requests to update the UI
    });
  }
  
  declineConfirmedRide(requestId: string): void {
    // Send the request to the backend to decline the confirmed ride
    this.rideRequestService.declineConfirmedRide(requestId).subscribe(() => {
      this.snackBar.open('🚫 Ride declined!', 'Close', { duration: 3000 });
      this.loadRequests(); // Reload requests to update the UI
    });
  }
  
  

  openRouteMap(pickup: string, dropoff: string): void {
    this.isMapDialogOpen = true;  // Set to true when the map modal is opened
    this.dialog.open(RideRouteMapDialogComponent, {
      width: '90vw',
      height: '90vh',
      data: { pickup, dropoff }
    }).afterClosed().subscribe(() => {
      this.isMapDialogOpen = false;  // Set to false when the modal is closed
    });
  }
  

  toggleMyRequests() {
    this.showMyRequests = !this.showMyRequests;
  }
  
  toggleMatchedRides() {
    this.showMatchedRides = !this.showMatchedRides;
  }

  currentUserId: string | null = null;

  rideRequests: RideRequestWithNames[] = [];
  yourRideRequests: RideRequestWithNames[] = [];
  matchedRideRequests: RideRequestWithNames[] = [];

  newRequest: RideRequest = {
    passengerId: '',
    pickupLocation: '',
    dropoffLocation: '',
    preferredTime: '',
    seatsNeeded: 1
  };

  constructor(
    private rideRequestService: RideRequestService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    const isLogged = await this.authService.isLoggedIn();
    if (isLogged) {
      this.currentUserId = this.authService.getUserIdFromToken();
      this.loadRequests();
    }
  }

  openEditModal(request: RideRequestWithNames): void {
    this.editedRequest = { ...request };  // Clone the selected request to prevent modifying original data
    this.showEditModal = true;
    this.showCreateModal = true;  // Show the modal
  }

  openCreateModal(): void {
    // Clear the newRequest object for creating a fresh request
    this.newRequest = {
      passengerId: this.currentUserId || '',
      pickupLocation: '',
      dropoffLocation: '',
      preferredTime: '',
      seatsNeeded: 1
    };
  
    this.showCreateModal = true;  // Show the modal for creating a new request
    this.showEditModal = false;  // Ensure the edit modal is hidden
  }

  decline(driverId: string, requestId: string): void {
    if (!driverId || !requestId) return;
  
    this.rideRequestService.declineFromRequest(requestId, driverId).subscribe({
      next: () => {
        // Successfully declined the driver, reload the requests
        this.snackBar.open('❌ Driver declined from request!', 'Close', { duration: 3000 });
        this.loadRequests();
      },
      error: (err) => {
        console.error('Error declining driver:', err);
        this.snackBar.open('⚠️ Error declining driver. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
  
  loadRequests(): void {
    this.rideRequestService.getWithNames().subscribe((data) => {
      this.rideRequests = data.filter(r => r.passengerId !== this.currentUserId && r.status !== 'MATCHED');
      this.yourRideRequests = data.filter(r => r.passengerId === this.currentUserId && r.status !== 'MATCHED');
      this.matchedRideRequests = data.filter(r => r.status === 'MATCHED' && r.passengerId === this.currentUserId);
    });
  }

  submitRequest(): void {
    if (!this.currentUserId) return;
  
    // If we're in the edit mode, we call the edit method
    if (this.showEditModal) {
      this.submitEditRequest();
    } else {
      // If we're creating a new ride request
      // Ensure that both pickup and dropoff locations are filled
     
  
      // Assign the current user as the passenger
      this.newRequest.passengerId = this.currentUserId;
  
      // Call the service to create the ride request
      this.rideRequestService.create(this.newRequest).subscribe({
        next: () => {
          this.snackBar.open('✅ Ride request submitted!', 'Close', { duration: 3000 });
          this.resetForm();
          this.loadRequests(); // Reload requests to update the UI
        },
        error: (err) => {
          console.error('Error submitting ride request:', err);
          this.snackBar.open('⚠️ Error submitting ride request. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }
  

  submitEditRequest(): void {
    if (!this.currentUserId || !this.editedRequest.id) return;

    this.editedRequest.passengerId = this.currentUserId; // Ensure passengerId is set to current user

    this.rideRequestService.editRideRequest(this.editedRequest).subscribe({
      next: () => {
        this.snackBar.open('✅ Ride request updated!', 'Close', { duration: 3000 });
        this.loadRequests(); // Reload requests to update the UI
        this.showEditModal = false; // Close the modal after updating
        this.showCreateModal = false;
      },
      error: (err) => {
        console.error('Error editing ride request:', err);
        this.snackBar.open('⚠️ Error updating ride request. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  confirm(driverId: string, requestId: string): void {
    this.rideRequestService.confirmDriver(requestId, driverId).subscribe(() => {
      this.snackBar.open('✅ Driver confirmed!', 'Close', { duration: 3000 });
      this.loadRequests();
    });
  }

  apply(requestId: string): void {
    if (!requestId || !this.currentUserId) return;
  
    this.rideRequestService.applyToRequest(requestId, this.currentUserId).subscribe(() => {
      this.snackBar.open('🚗 Applied to ride request!', 'Close', { duration: 3000 });
      this.loadRequests();
    });
  }
  
  unapply(requestId: string): void {
    if (!requestId || !this.currentUserId) return;
  
    this.rideRequestService.unapplyFromRequest(requestId, this.currentUserId).subscribe(() => {
      this.snackBar.open('❌ Unapplied from ride request!', 'Close', { duration: 3000 });
      this.loadRequests();
    });
  }
  

  getConfirmedDriverName(request: RideRequestWithNames): string {
    const driver = request.appliedDrivers?.find(d => d.id === request.confirmedDriverId);
    return driver ? driver.fullName : 'N/A';
  }

  openLocationPicker(type: 'pickup' | 'dropoff'): void {
    this.isMapDialogOpen = true;
  
    const dialogRef = this.dialog.open(LocationMapDialogComponent, {
      width: '90vw',
      height: '90vh',
      maxWidth: '100vw',
      hasBackdrop: true
    });
  
    dialogRef.afterClosed().subscribe((coords) => {
      this.isMapDialogOpen = false;
  
      if (coords) {
        this.reverseGeocode(coords.lat, coords.lng)
          .then((address) => {
            // Check if we're editing or creating a new request
            if (this.showEditModal) {
              // Editing an existing request
              if (type === 'pickup') {
                this.editedRequest.pickupLocation = address;
              } else {
                this.editedRequest.dropoffLocation = address;
              }
            } else {
              // Creating a new request
              if (type === 'pickup') {
                this.newRequest.pickupLocation = address;
              } else {
                this.newRequest.dropoffLocation = address;
              }
            }
          })
          .catch(() => {
            // Fallback to the coordinates if reverse geocoding fails
            const fallback = `Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)}`;
            if (this.showEditModal) {
              // Editing an existing request
              if (type === 'pickup') {
                this.editedRequest.pickupLocation = fallback;
              } else {
                this.editedRequest.dropoffLocation = fallback;
              }
            } else {
              // Creating a new request
              if (type === 'pickup') {
                this.newRequest.pickupLocation = fallback;
              } else {
                this.newRequest.dropoffLocation = fallback;
              }
            }
          });
      }
    });
  }
  
  

  private async reverseGeocode(lat: number, lng: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    const data = await response.json();
    return data.display_name || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  }

  toggleApply(requestId: string): void {
    if (!this.currentUserId) return;
  
    const isApplied = this.isApplied(requestId);
  
    if (isApplied) {
      this.unapply(requestId); // If applied, unapply
    } else {
      this.apply(requestId); // If not applied, apply
    }
  }
  
  isApplied(requestId: string): boolean {
    const request = this.rideRequests.find(r => r.id === requestId);
    return request?.appliedDrivers?.some(driver => driver.id === this.currentUserId) ?? false;
  }
  

  private resetForm(): void {
    this.newRequest = {
      passengerId: '',
      pickupLocation: '',
      dropoffLocation: '',
      preferredTime: '',
      seatsNeeded: 1
    };
    this.showCreateModal = false;
  }
}
