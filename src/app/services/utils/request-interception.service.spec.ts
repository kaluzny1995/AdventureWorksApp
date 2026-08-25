import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';

import { RequestInterceptionService } from './request-interception.service';
import { AuthenticationService } from '../awfapi-user/authentication.service';
import { AppConfigService } from './app-config.service';
import { FAST_API_SERVER } from '../../app.constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RequestInterceptionService', () => {
  let service: RequestInterceptionService;
  let authService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    authSpy.getToken.and.returnValue('test-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RequestInterceptionService,
        AppConfigService,
        { provide: AuthenticationService, useValue: authSpy }
      ]
    });
    service = TestBed.inject(RequestInterceptionService);
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    it('should add Authorization header for auth-required URLs', () => {
      const req = new HttpRequest('GET', FAST_API_SERVER + 'test');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      expect(next.handle).toHaveBeenCalled();
      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-token');
      expect(handledReq.headers.get('Accept')).toBe('application/json');
    });

    it('should not modify request for non-auth-required URLs', () => {
      const req = new HttpRequest('GET', FAST_API_SERVER + 'public_endpoint');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      expect(next.handle).toHaveBeenCalled();
      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBeNull();
    });

    it('should add headers for get_persons endpoint', () => {
      const req = new HttpRequest('GET', FAST_API_SERVER + 'get_persons');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-token');
    });
  });
});
