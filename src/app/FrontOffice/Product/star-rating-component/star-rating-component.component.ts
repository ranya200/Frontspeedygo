import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [NgFor],
  template: `
    <span class="stars">
      <span *ngFor="let star of stars; let i = index"
            (click)="selectRating(i + 1)"
            [class.filled]="i < rating">
        ★
      </span>
    </span>
  `,
  styles: [`
    .stars {
      font-size: 22px;
      cursor: pointer;
    }
    .stars span {
      color: lightgray;
      margin-right: 2px;
      transition: color 0.2s;
    }
    .stars span.filled {
      color: gold;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() readonly = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars = Array(5).fill(0);

  selectRating(r: number) {
    if (!this.readonly) {
      console.log('⭐ Star clicked:', r);
      this.rating = r;
      this.ratingChange.emit(r);
    }
  }
}
