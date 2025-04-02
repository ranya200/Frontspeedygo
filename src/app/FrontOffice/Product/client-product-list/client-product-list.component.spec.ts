import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProductListComponent } from './client-product-list.component';

describe('ClientProductListComponent', () => {
  let component: ClientProductListComponent;
  let fixture: ComponentFixture<ClientProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProductListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
