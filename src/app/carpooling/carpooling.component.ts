import { Component, OnInit } from '@angular/core';
import { CarpoolingService } from '../services/carpooling/carpooling.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-carpooling',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Import FormsModule for form handling
  templateUrl: './carpooling.component.html',
  styleUrls: ['./carpooling.component.css']
})
export class CarpoolingComponent implements OnInit {
  carpoolingList: Carpool[] = [];
  newCarpool: Carpool = {
    driverName: '',
    pickupLocation: '',
    dropoffLocation: '',
    departureTime: '',
    availableSeats: 0,
    pricePerSeat: 0,
    typeservice: 'Carpooling'
  };

  constructor(private carpoolingService: CarpoolingService) {}

  ngOnInit(): void {
    this.loadCarpooling();
  }


  loadCarpooling() {
    this.carpoolingService.getCarpooling().subscribe(
      (data) => {
        this.carpoolingList = data;
      },
      (error) => {
        console.error('Error fetching carpooling data:', error);
      }
    );
  }


  submitCarpooling() {
    this.carpoolingService.addCarpooling(this.newCarpool).subscribe(
      (response) => {
        console.log('Carpooling submitted:', response);
        alert('Carpooling added successfully!');
        this.loadCarpooling(); 
        this.resetForm();
      },
      (error) => {
        console.error('Error submitting carpooling:', error);
        alert('Failed to submit carpooling.');
      }
    );
  }

  
  resetForm() {
    this.newCarpool = {
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
