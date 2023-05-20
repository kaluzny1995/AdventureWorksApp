import { TestBed } from '@angular/core/testing';

import { AuthenticationGuard } from './authentication.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationGuard]
    });
    guard = TestBed.inject(AuthenticationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
