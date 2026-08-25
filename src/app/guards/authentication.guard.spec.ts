import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from '../services/awfapi-user/authentication.service';
import { UrlProcessingService } from '../services/url/url-processing.service';
import { AppConfigService } from '../services/utils/app-config.service';
import { EAuthenticationStatus } from '../models/utils/e-authentication-status';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['testAuthentication', 'removeToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(new Promise<boolean>(() => {}));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationGuard,
        UrlProcessingService,
        { provide: AppConfigService, useValue: {} },
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(AuthenticationGuard);
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when authenticated (synchronous return value)', () => {
    authService.testAuthentication.and.returnValue(of({title: EAuthenticationStatus.AUTHENTICATED}));
    const route = {} as ActivatedRouteSnapshot;
    const state = {url: '/test'} as RouterStateSnapshot;
    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('should return false when unauthenticated (synchronous subscription)', () => {
    authService.testAuthentication.and.returnValue(of({title: EAuthenticationStatus.UNAUTHENTICATED}));
    const route = {} as ActivatedRouteSnapshot;
    const state = {url: '/test'} as RouterStateSnapshot;
    expect(guard.canActivate(route, state)).toBeFalse();
  });

  it('should call removeToken when unauthenticated', () => {
    authService.testAuthentication.and.returnValue(of({title: EAuthenticationStatus.UNAUTHENTICATED}));
    const route = {} as ActivatedRouteSnapshot;
    const state = {url: '/test'} as RouterStateSnapshot;
    guard.canActivate(route, state);
    expect(authService.removeToken).toHaveBeenCalled();
  });

  it('should return true on HTTP error', () => {
    authService.testAuthentication.and.returnValue(throwError(() => new Error('error')));
    const route = {} as ActivatedRouteSnapshot;
    const state = {url: '/test'} as RouterStateSnapshot;
    expect(guard.canActivate(route, state)).toBeTrue();
  });
});
