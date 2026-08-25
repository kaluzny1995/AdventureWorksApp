import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { AppConfigService } from '../utils/app-config.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImV4cCI6MTczNTY4OTYwMH0.signature';

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

    it('should overwrite existing token', () => {
      service.setToken('first-token');
      service.setToken('second-token');
      expect(service.getToken()).toBe('second-token');
    });

    it('should store token in localStorage', () => {
      service.setToken('my-jwt-token');
      expect(localStorage.getItem('token')).toBe('my-jwt-token');
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

    it('should return false when token is empty string', () => {
      service.setToken('');
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
      localStorage.setItem('phone_number_type_key', 'value');
      service.removeToken(true);
      expect(service.getToken()).toBe('');
      expect(localStorage.getItem('person_key')).toBeNull();
      expect(localStorage.getItem('phone_number_type_key')).toBeNull();
    });

    it('should not remove non-prefixed entries when isPrefixesCleared is true', () => {
      service.setToken('test-token');
      localStorage.setItem('other_key', 'value');
      service.removeToken(true);
      expect(localStorage.getItem('other_key')).toBe('value');
    });

    it('should handle removing when no token exists', () => {
      expect(() => service.removeToken(false)).not.toThrow();
    });
  });

  describe('authenticate', () => {
    it('should POST to token endpoint with FormData', () => {
      const credentials = new FormData();
      credentials.append('username', 'admin');
      credentials.append('password', 'secret');
      service.authenticate(credentials).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/token');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe(credentials);
      req.flush({ access: 'eyJhbGciOiJIUzI1NiJ9.test', token_type: 'bearer' });
    });

    it('should return JWT token from response', () => {
      const credentials = new FormData();
      let result: any;
      service.authenticate(credentials).subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/token');
      req.flush({ access: 'jwt-access-token', token_type: 'bearer' });
      expect(result.access).toBe('jwt-access-token');
      expect(result.token_type).toBe('bearer');
    });

    it('should handle authentication failure', () => {
      const credentials = new FormData();
      let error: any;
      service.authenticate(credentials).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/token');
      req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
      expect(error).toBeTruthy();
    });

    it('should handle server error during authentication', () => {
      const credentials = new FormData();
      let error: any;
      service.authenticate(credentials).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/token');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      expect(error).toBeTruthy();
    });
  });

  describe('testAuthentication', () => {
    it('should GET test endpoint', () => {
      service.testAuthentication().subscribe();
      const req = httpMock.expectOne('http://localhost:8080/test');
      expect(req.request.method).toBe('GET');
      req.flush({ title: 'AUTHENTICATED' });
    });

    it('should return authentication status', () => {
      let result: any;
      service.testAuthentication().subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/test');
      req.flush({ title: 'AUTHENTICATED' });
      expect(result.title).toBe('AUTHENTICATED');
    });

    it('should handle unauthenticated response', () => {
      let error: any;
      service.testAuthentication().subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/test');
      req.flush('Not authenticated', { status: 401, statusText: 'Unauthorized' });
      expect(error).toBeTruthy();
    });
  });

  describe('verifyPassword', () => {
    it('should GET verify endpoint with password in path', () => {
      service.verifyPassword('mypass').subscribe();
      const req = httpMock.expectOne('http://localhost:8080/verify/mypass');
      expect(req.request.method).toBe('GET');
      req.flush({ verified: true });
    });

    it('should return verification result', () => {
      let result: any;
      service.verifyPassword('correct_password').subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/verify/correct_password');
      req.flush({ verified: true });
      expect(result.verified).toBeTrue();
    });

    it('should handle incorrect password', () => {
      let error: any;
      service.verifyPassword('wrong_password').subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/verify/wrong_password');
      req.flush('Password incorrect', { status: 403, statusText: 'Forbidden' });
      expect(error).toBeTruthy();
    });

    it('should handle password with special characters', () => {
      service.verifyPassword('p@ss!#$%').subscribe();
      const req = httpMock.expectOne(request => request.url.includes('verify/'));
      expect(req.request.url).toContain('verify/p@ss!#$%');
      req.flush({ verified: true });
    });
  });

  describe('getCurrentUser', () => {
    it('should GET current_user endpoint', () => {
      service.getCurrentUser().subscribe();
      const req = httpMock.expectOne('http://localhost:8080/current_user');
      expect(req.request.method).toBe('GET');
      req.flush({ username: 'testuser', role: 'admin' });
    });

    it('should return user details', () => {
      let result: any;
      service.getCurrentUser().subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/current_user');
      req.flush({ username: 'admin', role: 'admin', email: 'admin@example.com' });
      expect(result.username).toBe('admin');
      expect(result.role).toBe('admin');
      expect(result.email).toBe('admin@example.com');
    });

    it('should handle unauthorized access', () => {
      let error: any;
      service.getCurrentUser().subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/current_user');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(error).toBeTruthy();
    });
  });
});
