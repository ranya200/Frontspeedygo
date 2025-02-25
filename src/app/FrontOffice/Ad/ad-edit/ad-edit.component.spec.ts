import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdComponent } from './ad-edit.component';

describe('AdEditComponent', () => {
  let component: EditAdComponent;
  let fixture: ComponentFixture<EditAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
