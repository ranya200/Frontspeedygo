export interface Carpool {
    id?: string;
    driverId?: string;
    driverName: string;
    pickupLocation: string;
    dropoffLocation: string;
    departureTime: string;
    availableSeats: number;
    pricePerSeat: number;
    typeservice: string;
  }
  