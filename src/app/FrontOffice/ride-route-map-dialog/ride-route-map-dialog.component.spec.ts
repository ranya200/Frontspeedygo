import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideRouteMapDialogComponent } from './ride-route-map-dialog.component';

describe('RideRouteMapDialogComponent', () => {
  let component: RideRouteMapDialogComponent;
  let fixture: ComponentFixture<RideRouteMapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideRouteMapDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideRouteMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
