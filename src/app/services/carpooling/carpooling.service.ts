import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Carpool {
  id?: string;
  driverName: string;
  pickupLocation: string;
  dropoffLocation: string;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: number;
  typeservice: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarpoolingService {
  private apiUrl = 'http://localhost:8089/speedygo/api/carpooling';

  constructor(private http: HttpClient) {}

  
  getCarpooling(): Observable<Carpool[]> {
    return this.http.get<Carpool[]>(this.apiUrl);
  }
  addCarpooling(carpool: Carpool): Observable<Carpool> {
    return this.http.post<Carpool>(this.apiUrl, carpool);
  }
  deleteCarpooling(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateCarpooling(id: string, carpool: Carpool): Observable<Carpool> {
    return this.http.put<Carpool>(`${this.apiUrl}/${id}`, carpool);
  }
}
