import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFormDelivaryComponent } from './vehicle-form-delivary.component';

describe('VehicleFormDelivaryComponent', () => {
  let component: VehicleFormDelivaryComponent;
  let fixture: ComponentFixture<VehicleFormDelivaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFormDelivaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleFormDelivaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
