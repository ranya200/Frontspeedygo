import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastpostFormComponent } from './fastpost-form.component';

describe('FastpostFormComponent', () => {
  let component: FastpostFormComponent;
  let fixture: ComponentFixture<FastpostFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FastpostFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FastpostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
