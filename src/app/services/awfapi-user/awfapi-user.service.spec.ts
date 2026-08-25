import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AwfapiUserService } from './awfapi-user.service';

describe('AwfapiUserService', () => {
  let service: AwfapiUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(AwfapiUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
