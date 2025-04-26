import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from 'src/app/models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://localhost:8089/speedygo/api/bookings'; // ✅ absolute URL

  constructor(private http: HttpClient) {}

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, booking);
  }

  confirmBooking(id: string): Observable<Booking> {
    return this.http.put<Booking>(`${this.baseUrl}/${id}/confirm`, {});
  }

  getBookingsForRide(rideId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/ride/${rideId}`);
  }
  getBookingsByDriverId(driverId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`http://localhost:8089/speedygo/api/bookings/by-driver/${driverId}`);
  }

  getBookingsForUser(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/user/${userId}`);
  }
  
  
  
}
