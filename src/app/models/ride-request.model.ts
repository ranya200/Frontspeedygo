export interface RideRequest {
    id?: string;
    passengerId: string;
    pickupLocation: string;
    dropoffLocation: string;
    preferredTime: string;
    seatsNeeded: number;
    status?: string;
    appliedDriverIds?: string[];
    confirmedDriverId?: string | null;
  }
  