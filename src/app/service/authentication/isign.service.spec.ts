import {TestBed} from '@angular/core/testing';

import {IsignService} from './isign.service';

describe('IsignService', () => {
  let service: IsignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
