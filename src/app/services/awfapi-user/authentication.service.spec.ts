import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AppConfigService } from '../utils/app-config.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const appConfigSpy = {
      apiUrl: 'http://localhost:8080/',
      prefixes: ['person_', 'phone_number_type_', 'person_phone_']
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        LocalStorageService,
        { provide: AppConfigService, useValue: appConfigSpy }
      ]
    });
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setToken / getToken', () => {
    it('should store and retrieve token', () => {
      service.setToken('test-token-123');
      expect(service.getToken()).toBe('test-token-123');
    });

    it('should return empty string when no token is stored', () => {
      expect(service.getToken()).toBe('');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token is stored', () => {
      service.setToken('some-token');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false when no token is stored', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('removeToken', () => {
    it('should remove token when isPrefixesCleared is false', () => {
      service.setToken('test-token');
      service.removeToken(false);
      expect(service.getToken()).toBe('');
    });

    it('should remove token and prefixed entries when isPrefixesCleared is true', () => {
      service.setToken('test-token');
      localStorage.setItem('person_key', 'value');
      service.removeToken(true);
      expect(service.getToken()).toBe('');
      expect(localStorage.getItem('person_key')).toBeNull();
    });
  });

  describe('authenticate', () => {
    it('should POST to token endpoint', () => {
      const credentials = new FormData();
      service.authenticate(credentials).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/token');
      expect(req.request.method).toBe('POST');
      req.flush({access: 'token123'});
    });
  });

  describe('testAuthentication', () => {
    it('should GET test endpoint', () => {
      service.testAuthentication().subscribe();
      const req = httpMock.expectOne('http://localhost:8080/test');
      expect(req.request.method).toBe('GET');
      req.flush({title: 'AUTHENTICATED'});
    });
  });

  describe('verifyPassword', () => {
    it('should GET verify endpoint with password', () => {
      service.verifyPassword('mypass').subscribe();
      const req = httpMock.expectOne('http://localhost:8080/verify/mypass');
      expect(req.request.method).toBe('GET');
      req.flush({verified: true});
    });
  });

  describe('getCurrentUser', () => {
    it('should GET current_user endpoint', () => {
      service.getCurrentUser().subscribe();
      const req = httpMock.expectOne('http://localhost:8080/current_user');
      expect(req.request.method).toBe('GET');
      req.flush({username: 'testuser'});
    });
  });
});
