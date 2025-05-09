import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationMapDialogComponent } from './location-map-dialog.component';

describe('LocationMapDialogComponent', () => {
  let component: LocationMapDialogComponent;
  let fixture: ComponentFixture<LocationMapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationMapDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
