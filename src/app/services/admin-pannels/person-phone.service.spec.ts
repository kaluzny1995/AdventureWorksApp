import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PersonPhoneService } from './person-phone.service';

describe('PersonPhoneService', () => {
  let service: PersonPhoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(PersonPhoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
