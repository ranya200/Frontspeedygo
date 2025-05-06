export interface Booking {
  id?: string;
  rideId: string;
  passengerId: string;
  seatsBooked: number;
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED'| 'CANCELED' |'FULL';

  // ✅ Champs enrichis du trajet
  pickupLocation?: string;
  dropoffLocation?: string;
  departureTime?: string; // ou Date si tu veux gérer en objet
  passengerName?: string;

}
