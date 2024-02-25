import { TestBed } from '@angular/core/testing';

import { JsonLoadingService } from './json-loading.service';

describe('EntityDescriptionService', () => {
  let service: JsonLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
