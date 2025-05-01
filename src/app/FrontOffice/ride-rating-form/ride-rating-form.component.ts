import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RatingService } from 'src/app/services/rating/rating.service';
import { RideRating } from 'src/app/models/ride-rating.model';

@Component({
  selector: 'app-ride-rating-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ride-rating-form.component.html',
  styleUrls: ['./ride-rating-form.component.css']
})
export class RideRatingFormComponent implements OnInit {
  @Input() rideId!: string;
  @Input() driverId!: string;
  @Input() passengerId!: string;
  @Input() existingRating?: RideRating;
  @Input() editMode: boolean = false;
  @Output() ratingUpdated = new EventEmitter<void>();

  form: FormGroup;
  submitted: boolean = false;
  canShowForm: boolean = true;
  alreadyRated: boolean = false;

  constructor(private fb: FormBuilder, private ratingService: RatingService) {
    this.form = this.fb.group({
      safetyScore: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      punctualityScore: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      comfortScore: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    if (this.editMode && this.existingRating) {
      // Prefill form in edit mode
      this.form.patchValue({
        safetyScore: this.existingRating.safetyScore,
        punctualityScore: this.existingRating.punctualityScore,
        comfortScore: this.existingRating.comfortScore,
        comment: this.existingRating.comment
      });
    } else {
      // Check if already rated (only in create mode)
      this.ratingService.getRatingsForRide(this.rideId).subscribe(ratings => {
        const match = ratings.find(r => r.passengerId === this.passengerId);
        if (match) {
          this.submitted = true;
          this.alreadyRated = true;
        }
      });
    }
  }
  showForm(): void {
    this.canShowForm = true;
  }

  submit(): void {
    if (!this.form.valid) return;

    const rating: RideRating = {
      ...this.form.value,
      rideId: this.rideId,
      driverId: this.driverId,
      passengerId: this.passengerId
    };

    if (this.editMode && this.existingRating?.id) {
      // 🔁 Update existing rating
      this.ratingService.updateRating(this.existingRating.id, rating).subscribe({
        next: () => {
          this.canShowForm = false; // hide form
          this.submitted = false; 
          this.ratingUpdated.emit(); 
          alert('✅ Rating updated successfully!');
        },
        error: () => {
          alert('❌ Failed to update rating.');
        }
      });
    } else {
      // 🆕 Submit new rating
      this.ratingService.submitRating(rating).subscribe({
        next: () => {
          this.submitted = true;
          this.canShowForm = false;
          this.form.reset({ safetyScore: 3, punctualityScore: 3, comfortScore: 3, comment: '' });
        },
        error: (err) => {
          if (err.status === 409) {
            alert('⚠️ You have already rated this ride.');
            this.submitted = true;
          } else {
            alert('❌ Failed to submit rating.');
          }
        }
      });
    }
  }

  toggleRatingForm(): void {
    this.canShowForm = !this.canShowForm;
  }
}