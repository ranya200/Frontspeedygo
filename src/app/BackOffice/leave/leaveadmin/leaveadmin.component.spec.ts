import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveadminComponent } from './leaveadmin.component';

describe('LeaveadminComponent', () => {
  let component: LeaveadminComponent;
  let fixture: ComponentFixture<LeaveadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
