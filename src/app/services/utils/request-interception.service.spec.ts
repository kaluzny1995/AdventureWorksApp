import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';

import { RequestInterceptionService } from './request-interception.service';
import { AuthenticationService } from '../awfapi-user/authentication.service';
import { AppConfigService } from './app-config.service';
import { FAST_API_SERVER, AUTH_REQUIRED_ADDRESSES } from '../../app.constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RequestInterceptionService', () => {
  let service: RequestInterceptionService;
  let authService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    authSpy.getToken.and.returnValue('test-jwt-token');

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
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
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
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
      expect(handledReq.headers.get('Accept')).toBe('application/json');
    });

    it('should add headers for verify endpoint', () => {
      const req = new HttpRequest('GET', FAST_API_SERVER + 'verify/mypassword');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    });

    it('should add headers for current_user endpoint', () => {
      const req = new HttpRequest('GET', FAST_API_SERVER + 'current_user');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    });

    it('should add headers for view_awfapi_user_profile endpoint', () => {
      const req = new HttpRequest('GET', FAST_API_SERVER + 'view_awfapi_user_profile/admin');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    });

    it('should add headers for change_awfapi_user_data endpoint', () => {
      const req = new HttpRequest('PUT', FAST_API_SERVER + 'change_awfapi_user_data/admin', {});
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    });

    it('should add headers for remove_awfapi_user_account endpoint', () => {
      const req = new HttpRequest('DELETE', FAST_API_SERVER + 'remove_awfapi_user_account/admin');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    });

    it('should add headers for create_person endpoint', () => {
      const req = new HttpRequest('POST', FAST_API_SERVER + 'create_person', {});
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    });

    it('should add headers for update_person endpoint', () => {
      const req = new HttpRequest('PUT', FAST_API_SERVER + 'update_person/1', {});
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    });

    it('should add headers for delete_person endpoint', () => {
      const req = new HttpRequest('DELETE', FAST_API_SERVER + 'delete_person/1');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    });

    it('should add headers for get_phone_number_types endpoint', () => {
      const req = new HttpRequest('GET', FAST_API_SERVER + 'get_phone_number_types');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    });

    it('should add headers for create_person_phone endpoint', () => {
      const req = new HttpRequest('POST', FAST_API_SERVER + 'create_person_phone', {});
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    });

    it('should not modify request for token endpoint', () => {
      const req = new HttpRequest('POST', FAST_API_SERVER + 'token', {});
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBeNull();
    });

    it('should not modify request for register endpoint', () => {
      const req = new HttpRequest('POST', FAST_API_SERVER + 'register_awfapi_user', {});
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBeNull();
    });

    it('should not modify request for search_by_phrases endpoint', () => {
      const req = new HttpRequest('GET', FAST_API_SERVER + 'search_by_phrases?first_name_phrase=John');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBeNull();
    });

    it('should use empty token when no token is stored', () => {
      authService.getToken.and.returnValue('');

      const req = new HttpRequest('GET', FAST_API_SERVER + 'test');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer ');
    });

    it('should use correct token from auth service', () => {
      authService.getToken.and.returnValue('specific-user-token');

      const req = new HttpRequest('GET', FAST_API_SERVER + 'get_persons');
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer specific-user-token');
    });

    it('should always include Accept header for auth-required URLs', () => {
      const req = new HttpRequest('POST', FAST_API_SERVER + 'create_person', {});
      const next = { handle: jasmine.createSpy('handle').and.returnValue(of({})) };

      service.intercept(req, next);

      const handledReq = next.handle.calls.first().args[0];
      expect(handledReq.headers.get('Accept')).toBe('application/json');
      expect(handledReq.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    });

    it('should verify all AUTH_REQUIRED_ADDRESSES are covered', () => {
      expect(AUTH_REQUIRED_ADDRESSES).toContain('test');
      expect(AUTH_REQUIRED_ADDRESSES).toContain('verify');
      expect(AUTH_REQUIRED_ADDRESSES).toContain('current_user');
      expect(AUTH_REQUIRED_ADDRESSES).toContain('get_persons');
      expect(AUTH_REQUIRED_ADDRESSES).toContain('create_person');
      expect(AUTH_REQUIRED_ADDRESSES).toContain('delete_person');
      expect(AUTH_REQUIRED_ADDRESSES).toContain('get_phone_number_types');
      expect(AUTH_REQUIRED_ADDRESSES).toContain('create_person_phone');
      expect(AUTH_REQUIRED_ADDRESSES).toContain('remove_awfapi_user_account');
    });
  });
});
