import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from 'src/app/services/rating/rating.service';
import { RideRating } from 'src/app/models/ride-rating.model';

@Component({
  selector: 'app-ride-ratings-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ride-ratings-list.component.html',
  styleUrls: ['./ride-ratings-list.component.css']
})
export class RideRatingsListComponent implements OnInit {
  @Input() rideId!: string;
  ratings: RideRating[] = [];

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    if (this.rideId) {
      this.ratingService.getRatingsForRide(this.rideId).subscribe(res => {
        this.ratings = res;
      });
    }
  }

  average(rating: RideRating): number {
    return (rating.safetyScore + rating.punctualityScore + rating.comfortScore) / 3;
  }
}
