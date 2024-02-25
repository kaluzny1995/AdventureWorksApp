import { TestBed } from '@angular/core/testing';

import { RequestInterceptionService } from './request-interception.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RequestInterceptionService', () => {
  let service: RequestInterceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestInterceptionService]
    });
    service = TestBed.inject(RequestInterceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
