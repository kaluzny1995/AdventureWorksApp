import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { JsonLoadingService } from './json-loading.service';

describe('EntityDescriptionService', () => {
  let service: JsonLoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(JsonLoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
