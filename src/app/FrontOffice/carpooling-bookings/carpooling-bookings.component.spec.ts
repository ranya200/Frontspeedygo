import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingBookingsComponent } from './carpooling-bookings.component';

describe('CarpoolingBookingsComponent', () => {
  let component: CarpoolingBookingsComponent;
  let fixture: ComponentFixture<CarpoolingBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarpoolingBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpoolingBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
