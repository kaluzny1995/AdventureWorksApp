import { TestBed } from '@angular/core/testing';

import { PersonPhoneService } from './person-phone.service';

describe('PersonPhoneService', () => {
  let service: PersonPhoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonPhoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
