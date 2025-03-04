import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionaddComponent } from './promotionadd.component';

describe('PromotionaddComponent', () => {
  let component: PromotionaddComponent;
  let fixture: ComponentFixture<PromotionaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionaddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
