import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CustomVehicleService {

  private apiUrl = 'http://localhost:8089/speedygo/api/vehicle/add-vehicle';

  constructor(private http: HttpClient) {}

  addVehicleWithImage(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData); // ✅ pas besoin d’en-tête
  }
}
