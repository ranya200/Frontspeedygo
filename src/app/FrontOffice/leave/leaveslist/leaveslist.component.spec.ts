import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveslistComponent } from './leaveslist.component';

describe('LeaveslistComponent', () => {
  let component: LeaveslistComponent;
  let fixture: ComponentFixture<LeaveslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
