import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AwfapiUserService } from './awfapi-user.service';
import { AppConfigService } from '../utils/app-config.service';

describe('AwfapiUserService', () => {
  let service: AwfapiUserService;
  let httpMock: HttpTestingController;

  const mockUser = {
    username: 'testuser',
    fullName: 'Test User',
    email: 'test@example.com',
    role: 'user'
  };

  const mockRegisteredUser = {
    username: 'newuser',
    password: 'securepass123',
    fullName: 'New User',
    email: 'new@example.com'
  };

  beforeEach(() => {
    const appConfigSpy = { apiUrl: 'http://localhost:8080/' };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AwfapiUserService,
        { provide: AppConfigService, useValue: appConfigSpy }
      ]
    });
    service = TestBed.inject(AwfapiUserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should POST to register endpoint', () => {
      service.register(mockRegisteredUser).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/register_awfapi_user');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRegisteredUser);
      req.flush({ success: true, message: 'User registered successfully' });
    });

    it('should return registration result', () => {
      let result: any;
      service.register(mockRegisteredUser).subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/register_awfapi_user');
      req.flush({ success: true, id: 100, message: 'User created' });
      expect(result.success).toBeTrue();
      expect(result.id).toBe(100);
    });

    it('should handle registration failure - duplicate username', () => {
      let error: any;
      service.register(mockRegisteredUser).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/register_awfapi_user');
      req.flush('Username already exists', { status: 409, statusText: 'Conflict' });
      expect(error).toBeTruthy();
    });

    it('should handle validation error', () => {
      const invalidUser = { username: '', password: '123' };
      let error: any;
      service.register(invalidUser).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/register_awfapi_user');
      req.flush('Validation failed', { status: 422, statusText: 'Unprocessable Entity' });
      expect(error).toBeTruthy();
    });

    it('should handle server error', () => {
      let error: any;
      service.register(mockRegisteredUser).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/register_awfapi_user');
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      expect(error).toBeTruthy();
    });
  });

  describe('view', () => {
    it('should GET user profile by username', () => {
      service.view('testuser').subscribe();
      const req = httpMock.expectOne('http://localhost:8080/view_awfapi_user_profile/testuser');
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should return user profile data', () => {
      let result: any;
      service.view('testuser').subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/view_awfapi_user_profile/testuser');
      req.flush(mockUser);
      expect(result.username).toBe('testuser');
      expect(result.fullName).toBe('Test User');
      expect(result.email).toBe('test@example.com');
    });

    it('should handle user not found', () => {
      let error: any;
      service.view('nonexistent').subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/view_awfapi_user_profile/nonexistent');
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
      expect(error).toBeTruthy();
    });

    it('should handle usernames with special characters', () => {
      service.view('user.name@test').subscribe();
      const req = httpMock.expectOne('http://localhost:8080/view_awfapi_user_profile/user.name@test');
      expect(req.request.method).toBe('GET');
      req.flush({ username: 'user.name@test' });
    });

    it('should handle unauthorized access', () => {
      let error: any;
      service.view('otheruser').subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/view_awfapi_user_profile/otheruser');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(error).toBeTruthy();
    });
  });

  describe('changeData', () => {
    it('should PUT to change data endpoint', () => {
      const data = { fullName: 'New Name', email: 'new@example.com' };
      service.changeData('testuser', data).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/change_awfapi_user_data/testuser');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(data);
      req.flush({ success: true });
    });

    it('should return update result', () => {
      const data = { fullName: 'Updated Name' };
      let result: any;
      service.changeData('testuser', data).subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/change_awfapi_user_data/testuser');
      req.flush({ success: true, message: 'Data updated' });
      expect(result.success).toBeTrue();
    });

    it('should handle update failure', () => {
      const data = { email: 'invalid-email' };
      let error: any;
      service.changeData('testuser', data).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/change_awfapi_user_data/testuser');
      req.flush('Invalid data', { status: 422, statusText: 'Unprocessable Entity' });
      expect(error).toBeTruthy();
    });

    it('should handle partial data updates', () => {
      const partialData = { email: 'only-email-changed@example.com' };
      service.changeData('testuser', partialData).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/change_awfapi_user_data/testuser');
      expect(req.request.body).toEqual(partialData);
      req.flush({ success: true });
    });
  });

  describe('changeCredentials', () => {
    it('should PUT to change credentials endpoint', () => {
      const creds = { oldPassword: 'oldpass', newPassword: 'newpass' };
      service.changeCredentials('testuser', creds).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/change_awfapi_user_credentials/testuser');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(creds);
      req.flush({ success: true });
    });

    it('should return credentials change result', () => {
      const creds = { oldPassword: 'old', newPassword: 'new' };
      let result: any;
      service.changeCredentials('testuser', creds).subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/change_awfapi_user_credentials/testuser');
      req.flush({ success: true, message: 'Credentials changed' });
      expect(result.success).toBeTrue();
    });

    it('should handle incorrect old password', () => {
      const creds = { oldPassword: 'wrong', newPassword: 'newpass' };
      let error: any;
      service.changeCredentials('testuser', creds).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/change_awfapi_user_credentials/testuser');
      req.flush('Incorrect password', { status: 403, statusText: 'Forbidden' });
      expect(error).toBeTruthy();
    });

    it('should handle user not found', () => {
      const creds = { oldPassword: 'old', newPassword: 'new' };
      let error: any;
      service.changeCredentials('nonexistent', creds).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/change_awfapi_user_credentials/nonexistent');
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
      expect(error).toBeTruthy();
    });
  });

  describe('removeAccount', () => {
    it('should DELETE to remove account endpoint', () => {
      service.removeAccount('testuser').subscribe();
      const req = httpMock.expectOne('http://localhost:8080/remove_awfapi_user_account/testuser');
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });

    it('should return deletion result', () => {
      let result: any;
      service.removeAccount('testuser').subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/remove_awfapi_user_account/testuser');
      req.flush({ success: true, message: 'Account removed' });
      expect(result.success).toBeTrue();
    });

    it('should handle deletion failure - user not found', () => {
      let error: any;
      service.removeAccount('nonexistent').subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/remove_awfapi_user_account/nonexistent');
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
      expect(error).toBeTruthy();
    });

    it('should handle unauthorized deletion', () => {
      let error: any;
      service.removeAccount('otheruser').subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/remove_awfapi_user_account/otheruser');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
      expect(error).toBeTruthy();
    });

    it('should handle usernames with special characters', () => {
      service.removeAccount('user.name@test').subscribe();
      const req = httpMock.expectOne('http://localhost:8080/remove_awfapi_user_account/user.name@test');
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });
  });
});
