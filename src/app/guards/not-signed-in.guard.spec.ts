import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NotSignedInGuard } from './not-signed-in.guard';

describe('NotSignedInGuard', () => {
  let guard: NotSignedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    guard = TestBed.inject(NotSignedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
