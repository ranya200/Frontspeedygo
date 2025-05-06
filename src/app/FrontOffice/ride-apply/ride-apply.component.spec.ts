import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideApplyComponent } from './ride-apply.component';

describe('RideApplyComponent', () => {
  let component: RideApplyComponent;
  let fixture: ComponentFixture<RideApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideApplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
