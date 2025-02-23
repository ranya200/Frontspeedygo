import { Component, OnInit } from '@angular/core';
import { CarpoolingService } from '../services/carpooling/carpooling.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderFrontComponent } from '../FrontOffice/header-front/header-front.component';
import { FooterFrontComponent } from '../FrontOffice/footer-front/footer-front.component';

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
  imports: [CommonModule, FormsModule, HeaderFrontComponent,FooterFrontComponent], // ✅ Import FormsModule for form handling
  templateUrl: './carpooling.component.html',
  styleUrls: ['./carpooling.component.css']
})
export class CarpoolingComponent implements OnInit {
  
  carpoolingList: Carpool[] = [];
  

  selectedCarpool: Carpool | null = null
  showSuggestRideModal: boolean = false;
  
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
        console.log(data)
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
        this.showSuggestRideModal = false;
      },
      (error) => {
        console.error('Error submitting carpooling:', error);
        alert('Failed to submit carpooling.');
      }
    );
  }

  deleteCarpool(id?: string) {
    if (!id) {
      console.error('Error: Cannot delete carpooling ride without an ID');
      alert('Error: Ride ID is missing!');
      return;
    }
  
    if (confirm('Are you sure you want to cancel this ride?')) {
      this.carpoolingService.deleteCarpooling(id).subscribe(
        () => {
          console.log('Carpooling ride canceled:', id);
          alert('Ride canceled successfully!');
          this.loadCarpooling(); // Refresh list after deleting
        },
        (error) => {
          console.error('Error canceling carpooling:', error);
          alert('Failed to cancel the ride.');
        }
      );
    }
  }


  selectCarpool(carpool: Carpool) {
    console.log('Selected Carpool:', carpool);
    this.selectedCarpool = { ...carpool }; 
    console.log('✔ selectedCarpool is now:', this.selectedCarpool); // ✅ Confirm value in console

  }


  updateCarpooling() {
    if (!this.selectedCarpool || !this.selectedCarpool.id) {
      alert('Error: No carpool selected for updating.');
      return;
    }

    this.carpoolingService.updateCarpooling(this.selectedCarpool.id, this.selectedCarpool).subscribe(
      (response) => {
        console.log('Carpooling updated:', response);
        alert('Carpooling updated successfully!');
        this.loadCarpooling(); 
        this.selectedCarpool = null; 
      },
      (error) => {
        console.error('Error updating carpooling:', error);
        alert('Failed to update carpooling.');
      }
    );
  }


  cancelUpdate() {
    this.selectedCarpool = null;
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
