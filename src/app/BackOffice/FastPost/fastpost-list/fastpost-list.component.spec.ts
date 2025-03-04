import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastpostListComponent } from './fastpost-list.component';

describe('FastpostListComponent', () => {
  let component: FastpostListComponent;
  let fixture: ComponentFixture<FastpostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FastpostListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FastpostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
