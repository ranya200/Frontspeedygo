import { TestBed } from '@angular/core/testing';

import { CustomVehicleService } from './custom-vehicle.service';

describe('CustomVehicleService', () => {
  let service: CustomVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
