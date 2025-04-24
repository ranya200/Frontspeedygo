import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  name: string;
  price: number;
  image: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  listProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:8089/speedygo/product/listProducts');
  }
}
