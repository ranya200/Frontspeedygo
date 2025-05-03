import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RideRequest } from 'src/app/models/ride-request.model';
import { Observable } from 'rxjs';
import { RideRequestDTO } from 'src/app/models/ride-request-dto';
import { RideRequestWithNames } from 'src/app/models/ride-request-with-names.model';




@Injectable({ providedIn: 'root' })
export class RideRequestService {
  private apiUrl = 'http://localhost:8089/speedygo/api/ride-requests';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RideRequest[]> {
    return this.http.get<RideRequest[]>(this.apiUrl);
  }

  create(request: RideRequest): Observable<RideRequest> {
    return this.http.post<RideRequest>(this.apiUrl, request);
  }

  applyToRequest(requestId: string, driverId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/apply/${driverId}`, {});
  }
  

  confirmDriver(requestId: string, driverId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${requestId}/confirm/${driverId}`, {});
  }

  getWithNames(): Observable<RideRequestWithNames[]> {
    return this.http.get<RideRequestWithNames[]>('http://localhost:8089/speedygo/api/ride-requests/with-names');
  }
  
  unapplyFromRequest(requestId: string, driverId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${requestId}/unapply/${driverId}`, {});
  }
  
  declineFromRequest(requestId: string, driverId: string): Observable<void> {
    return this.http.put<void>(`http://localhost:8089/speedygo/api/ride-requests/${requestId}/decline/${driverId}`, {});
  }
  
  declineConfirmedRide(requestId: string): Observable<any> {
    
    return this.http.put(`http://localhost:8089/speedygo/api/ride-requests/${requestId}/decline`, {});
  }
  
}
