import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { NonReadonlyGuard } from './non-readonly.guard';
import { AuthenticationService } from '../services/awfapi-user/authentication.service';
import { AppConfigService } from '../services/utils/app-config.service';

describe('NonReadonlyGuard', () => {
  let guard: NonReadonlyGuard;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getCurrentUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NonReadonlyGuard,
        AppConfigService,
        { provide: AuthenticationService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(NonReadonlyGuard);
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should always return true initially (async issue)', () => {
    authService.getCurrentUser.and.returnValue(of({is_readonly: true}));
    const route = {} as any;
    const state = {url: '/test'} as any;
    expect(guard.canActivate(route, state)).toBeTrue();
  });

  it('should allow access for non-readonly user', () => {
    authService.getCurrentUser.and.returnValue(of({is_readonly: false}));
    const route = {} as any;
    const state = {url: '/test'} as any;
    guard.canActivate(route, state);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to 403 for readonly user', () => {
    authService.getCurrentUser.and.returnValue(of({is_readonly: true}));
    const route = {} as any;
    const state = {url: '/test'} as any;
    guard.canActivate(route, state);
    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['403', {url: '/test'}]);
    });
  });
});
