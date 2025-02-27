import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFormAdminComponent } from './vehicle-form-admin.component';

describe('VehicleFormAdminComponent', () => {
  let component: VehicleFormAdminComponent;
  let fixture: ComponentFixture<VehicleFormAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFormAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleFormAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
