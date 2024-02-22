import { TestBed } from '@angular/core/testing';

import { ColumnDisplayingService } from './column-displaying.service';

describe('ColumnDisplayingService', () => {
  let service: ColumnDisplayingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColumnDisplayingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
