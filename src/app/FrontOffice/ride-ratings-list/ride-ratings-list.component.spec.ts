import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideRatingsListComponent } from './ride-ratings-list.component';

describe('RideRatingsListComponent', () => {
  let component: RideRatingsListComponent;
  let fixture: ComponentFixture<RideRatingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideRatingsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideRatingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
