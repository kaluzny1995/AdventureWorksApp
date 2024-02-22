import { TestBed } from '@angular/core/testing';

import { NonReadonlyGuard } from './non-readonly.guard';

describe('NonReadonlyGuard', () => {
  let guard: NonReadonlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NonReadonlyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
