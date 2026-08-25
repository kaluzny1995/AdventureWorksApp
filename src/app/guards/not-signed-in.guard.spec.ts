import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { NotSignedInGuard } from './not-signed-in.guard';
import { AuthenticationService } from '../services/awfapi-user/authentication.service';
import { AppConfigService } from '../services/utils/app-config.service';
import { EAuthenticationStatus } from '../models/utils/e-authentication-status';

describe('NotSignedInGuard', () => {
  let guard: NotSignedInGuard;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['testAuthentication']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotSignedInGuard,
        AppConfigService,
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(NotSignedInGuard);
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when not authenticated', () => {
    authService.testAuthentication.and.returnValue(of({title: EAuthenticationStatus.UNAUTHENTICATED}));
    const route = {} as any;
    const state = {url: '/register'} as any;
    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('should return false for authenticated user (of() fires synchronously)', () => {
    authService.testAuthentication.and.returnValue(of({title: EAuthenticationStatus.AUTHENTICATED}));
    const route = {} as any;
    const state = {url: '/home'} as any;
    expect(guard.canActivate(route, state)).toBeFalse();
  });

  it('should allow access on HTTP error', () => {
    authService.testAuthentication.and.returnValue(throwError(() => new Error('error')));
    const route = {} as any;
    const state = {url: '/register'} as any;
    expect(guard.canActivate(route, state)).toBeTrue();
  });
});
