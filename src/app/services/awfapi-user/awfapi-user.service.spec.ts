import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AwfapiUserService } from './awfapi-user.service';
import { AppConfigService } from '../utils/app-config.service';

describe('AwfapiUserService', () => {
  let service: AwfapiUserService;
  let httpMock: HttpTestingController;

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
      const user = {username: 'test', password: 'pass'};
      service.register(user).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/register_awfapi_user');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(user);
      req.flush({success: true});
    });
  });

  describe('view', () => {
    it('should GET user profile by username', () => {
      service.view('testuser').subscribe();
      const req = httpMock.expectOne('http://localhost:8080/view_awfapi_user_profile/testuser');
      expect(req.request.method).toBe('GET');
      req.flush({username: 'testuser'});
    });
  });

  describe('changeData', () => {
    it('should PUT to change data endpoint', () => {
      const data = {fullName: 'New Name'};
      service.changeData('testuser', data).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/change_awfapi_user_data/testuser');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(data);
      req.flush({success: true});
    });
  });

  describe('changeCredentials', () => {
    it('should PUT to change credentials endpoint', () => {
      const creds = {newPassword: 'newpass'};
      service.changeCredentials('testuser', creds).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/change_awfapi_user_credentials/testuser');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(creds);
      req.flush({success: true});
    });
  });

  describe('removeAccount', () => {
    it('should DELETE to remove account endpoint', () => {
      service.removeAccount('testuser').subscribe();
      const req = httpMock.expectOne('http://localhost:8080/remove_awfapi_user_account/testuser');
      expect(req.request.method).toBe('DELETE');
      req.flush({success: true});
    });
  });
});
