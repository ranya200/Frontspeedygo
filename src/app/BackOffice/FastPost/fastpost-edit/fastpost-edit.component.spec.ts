import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastpostEditComponent } from './fastpost-edit.component';

describe('FastpostEditComponent', () => {
  let component: FastpostEditComponent;
  let fixture: ComponentFixture<FastpostEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FastpostEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FastpostEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
