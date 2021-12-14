import { TestBed } from '@angular/core/testing';

import { MemoServiceService } from './memo-service.service';

describe('MemoServiceService', () => {
  let service: MemoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
