export interface RideRequestDTO {
    id: string;
    passengerId: string;
    pickupLocation: string;
    dropoffLocation: string;
    preferredTime: string;
    seatsNeeded: number;
    status: string;
    confirmedDriverId: string | null;
    appliedDrivers: {
      id: string;
      fullName: string;
    }[];
  }
  