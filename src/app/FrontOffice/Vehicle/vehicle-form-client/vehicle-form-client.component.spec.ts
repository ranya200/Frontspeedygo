import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFormClientComponent } from './vehicle-form-client.component';

describe('VehicleFormClientComponent', () => {
  let component: VehicleFormClientComponent;
  let fixture: ComponentFixture<VehicleFormClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFormClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleFormClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
