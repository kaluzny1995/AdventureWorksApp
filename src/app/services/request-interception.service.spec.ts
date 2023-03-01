import { TestBed } from '@angular/core/testing';

import { RequestInterceptionService } from './request-interception.service';

describe('RequestInterceptionService', () => {
  let service: RequestInterceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestInterceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
