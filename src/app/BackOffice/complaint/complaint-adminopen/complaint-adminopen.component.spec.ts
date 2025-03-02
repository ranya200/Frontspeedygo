import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintAdminopenComponent } from './complaint-adminopen.component';

describe('ComplaintAdminopenComponent', () => {
  let component: ComplaintAdminopenComponent;
  let fixture: ComponentFixture<ComplaintAdminopenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintAdminopenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintAdminopenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
