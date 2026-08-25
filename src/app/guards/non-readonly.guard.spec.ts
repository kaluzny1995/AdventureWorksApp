import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NonReadonlyGuard } from './non-readonly.guard';

describe('NonReadonlyGuard', () => {
  let guard: NonReadonlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    guard = TestBed.inject(NonReadonlyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
