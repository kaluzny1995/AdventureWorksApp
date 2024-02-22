import { TestBed } from '@angular/core/testing';

import { FilterParamsService } from './filter-params.service';

describe('FilterParamsService', () => {
  let service: FilterParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
