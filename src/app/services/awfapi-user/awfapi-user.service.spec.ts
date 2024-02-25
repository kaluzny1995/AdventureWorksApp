import { TestBed } from '@angular/core/testing';

import { AwfapiUserService } from './awfapi-user.service';

describe('AwfapiUserService', () => {
  let service: AwfapiUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwfapiUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
