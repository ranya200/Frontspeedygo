import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintAdminComponent } from './complaint-admin.component';

describe('ComplaintAdminComponent', () => {
  let component: ComplaintAdminComponent;
  let fixture: ComponentFixture<ComplaintAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
