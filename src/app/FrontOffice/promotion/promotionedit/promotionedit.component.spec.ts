import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotioneditComponent } from './promotionedit.component';

describe('PromotioneditComponent', () => {
  let component: PromotioneditComponent;
  let fixture: ComponentFixture<PromotioneditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotioneditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotioneditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
