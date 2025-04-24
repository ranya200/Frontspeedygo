import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  constructor(private http: HttpClient) {}

  getRecommendations(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:8089/speedygo/recommendations/${userId}`);
  }
}
