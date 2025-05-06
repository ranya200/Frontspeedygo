export interface RideRequestWithNames {
    id: string;
    passengerId: string;
    pickupLocation: string;
    dropoffLocation: string;
    preferredTime: string;
    seatsNeeded: number;
    status: string;
    confirmedDriverId: string | null;
  
    // ✅ Add this to fix the error
    appliedDrivers: {
      id: string;
      fullName: string;
    }[];
  }
  