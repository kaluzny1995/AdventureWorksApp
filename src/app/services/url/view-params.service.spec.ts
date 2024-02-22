import { TestBed } from '@angular/core/testing';

import { ViewParamsService } from './view-params.service';

describe('ViewParamsService', () => {
  let service: ViewParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
