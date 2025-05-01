import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RideRating } from 'src/app/models/ride-rating.model';


@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = 'http://localhost:8089/speedygo/api/ratings';

  constructor(private http: HttpClient) {}

  submitRating(rating: RideRating): Observable<RideRating> {
    return this.http.post<RideRating>(`${this.baseUrl}`, rating);
  }

  getRatingsForDriver(driverId: string): Observable<RideRating[]> {
    return this.http.get<RideRating[]>(`${this.baseUrl}/driver/${driverId}`);
  }

  getRatingsForRide(rideId: string): Observable<RideRating[]> {
    return this.http.get<RideRating[]>(`${this.baseUrl}/ride/${rideId}`);
  }

  getGlobalBadges(): Observable<{ [driverId: string]: string }> {
    return this.http.get<{ [driverId: string]: string }>(`${this.baseUrl}/badges/global`);
  }
  
  updateRating(ratingId: string, updatedRating: RideRating): Observable<RideRating> {
    return this.http.put<RideRating>(`${this.baseUrl}/${ratingId}`, updatedRating);
  }

  getUserRatingForRide(rideId: string, passengerId: string): Observable<RideRating> {
    return this.http.get<RideRating>(`${this.baseUrl}/ride/${rideId}/user/${passengerId}`);
  }
  
  
}
