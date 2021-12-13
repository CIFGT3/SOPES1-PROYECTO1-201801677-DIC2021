import { TestBed } from '@angular/core/testing';

import { CpuServiceService } from './cpu-service.service';

describe('CpuServiceService', () => {
  let service: CpuServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpuServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
