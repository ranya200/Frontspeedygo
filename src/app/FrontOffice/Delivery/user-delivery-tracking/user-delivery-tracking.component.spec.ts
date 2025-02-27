import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeliveryTrackingComponent } from './user-delivery-tracking.component';

describe('UserDeliveryTrackingComponent', () => {
  let component: UserDeliveryTrackingComponent;
  let fixture: ComponentFixture<UserDeliveryTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDeliveryTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDeliveryTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
