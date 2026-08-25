import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PhoneNumberTypeService } from './phone-number-type.service';

describe('PhoneNumberTypeService', () => {
  let service: PhoneNumberTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(PhoneNumberTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
