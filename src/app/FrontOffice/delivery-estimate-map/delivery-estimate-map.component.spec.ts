import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryEstimateMapComponent } from './delivery-estimate-map.component';

describe('DeliveryEstimateMapComponent', () => {
  let component: DeliveryEstimateMapComponent;
  let fixture: ComponentFixture<DeliveryEstimateMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryEstimateMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryEstimateMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
