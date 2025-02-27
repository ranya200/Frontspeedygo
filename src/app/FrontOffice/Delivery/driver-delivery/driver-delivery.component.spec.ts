import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDeliveryComponent } from './driver-delivery.component';

describe('DriverDeliveryComponent', () => {
  let component: DriverDeliveryComponent;
  let fixture: ComponentFixture<DriverDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverDeliveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
