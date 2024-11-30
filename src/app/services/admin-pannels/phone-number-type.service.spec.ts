import { TestBed } from '@angular/core/testing';

import { PhoneNumberTypeService } from './phone-number-type.service';

describe('PhoneNumberTypeService', () => {
  let service: PhoneNumberTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhoneNumberTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
