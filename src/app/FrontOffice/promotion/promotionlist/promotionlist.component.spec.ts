import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionlistComponent } from './promotionlist.component';

describe('PromotionlistComponent', () => {
  let component: PromotionlistComponent;
  let fixture: ComponentFixture<PromotionlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
