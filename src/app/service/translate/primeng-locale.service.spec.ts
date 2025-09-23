import {TestBed} from '@angular/core/testing';

import {PrimengLocaleService} from './primeng-locale.service';

describe('PrimengLocaleService', () => {
  let service: PrimengLocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrimengLocaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
