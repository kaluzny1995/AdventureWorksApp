import { TestBed } from '@angular/core/testing';

import { UrlProcessingService } from './url-processing.service';

describe('UtilsService', () => {
  let service: UrlProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
