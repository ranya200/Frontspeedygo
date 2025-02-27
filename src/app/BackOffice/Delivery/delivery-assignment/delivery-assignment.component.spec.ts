import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAssignmentComponent } from './delivery-assignment.component';

describe('DeliveryAssignmentComponent', () => {
  let component: DeliveryAssignmentComponent;
  let fixture: ComponentFixture<DeliveryAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
