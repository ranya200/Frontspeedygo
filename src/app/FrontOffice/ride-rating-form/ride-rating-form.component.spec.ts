import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideRatingFormComponent } from './ride-rating-form.component';

describe('RideRatingFormComponent', () => {
  let component: RideRatingFormComponent;
  let fixture: ComponentFixture<RideRatingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideRatingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideRatingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
