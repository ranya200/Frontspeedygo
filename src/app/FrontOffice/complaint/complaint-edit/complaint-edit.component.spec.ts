import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintEditComponent } from './complaint-edit.component';

describe('ComplaintEditComponent', () => {
  let component: ComplaintEditComponent;
  let fixture: ComponentFixture<ComplaintEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
