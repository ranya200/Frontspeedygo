import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  
  private baseUrl = 'http://localhost:8089/speedygo/api/favorites';

  constructor(private http: HttpClient) {}

  getFavorites(userId: string): Observable<string[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}`).pipe(
      map(favs => favs.map(f => f.rideId))
    );
  }

  addFavorite(userId: string, rideId: string): Observable<any> {
    return this.http.post(this.baseUrl, { userId, rideId });
  }

  removeFavorite(userId: string, rideId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}?userId=${userId}&rideId=${rideId}`);
  }
}
