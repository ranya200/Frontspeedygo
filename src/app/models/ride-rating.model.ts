export interface RideRating {
    id?: string;
    rideId: string;
    driverId: string;
    passengerId: string;
    safetyScore: number;
    punctualityScore: number;
    comfortScore: number;
    comment?: string;
    createdAt?: Date;
  }
  