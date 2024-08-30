import { TestBed } from '@angular/core/testing';

import { DesingService } from './desing.service';

describe('DesingService', () => {
  let service: DesingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
