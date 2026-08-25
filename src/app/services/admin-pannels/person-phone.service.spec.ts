import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PersonPhoneService } from './person-phone.service';
import { AppConfigService } from '../utils/app-config.service';
import { QueryParamsService } from '../url/query-params.service';
import { UrlProcessingService } from '../url/url-processing.service';
import { FilterParamsService } from '../url/filter-params.service';
import { QueryParams } from 'src/app/models/admin-pannels/common/query-params';
import { EOrderType } from 'src/app/models/admin-pannels/common/e-order-type';
import { PersonPhoneInput } from 'src/app/models/admin-pannels/person-phones/person-phone';

describe('PersonPhoneService', () => {
  let service: PersonPhoneService;
  let httpMock: HttpTestingController;

  const mockPersonPhoneApiResponse = {
    business_entity_id: 1,
    phone_number: '398-4567',
    phone_number_type_id: 1,
    modified_date: '2023-03-10T12:00:00Z'
  };

  const mockPersonPhonesListResponse = [
    mockPersonPhoneApiResponse,
    {
      business_entity_id: 1,
      phone_number: '555-1234',
      phone_number_type_id: 2,
      modified_date: '2023-07-22T09:30:00Z'
    },
    {
      business_entity_id: 2,
      phone_number: '555-9876',
      phone_number_type_id: 1,
      modified_date: '2023-08-15T16:45:00Z'
    }
  ];

  beforeEach(() => {
    const appConfig = {
      apiUrl: 'http://localhost:8080/',
      personPhoneDefaults: {
        idSeparator: '|',
        availableColumns: ['personFullName', 'phoneNumber', 'phoneNumberTypeName'],
        availableColumnNames: ['Person', 'Phone Number', 'Type'],
        displayedIndices: [0, 1, 2],
        availableFilters: ['personIds'],
        availableFilterNames: ['Person IDs']
      },
      defaultQueryParams: new QueryParams(1, 10, null, null, EOrderType.ASC)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PersonPhoneService,
        QueryParamsService,
        UrlProcessingService,
        FilterParamsService,
        { provide: AppConfigService, useValue: appConfig }
      ]
    });
    service = TestBed.inject(PersonPhoneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('defaults', () => {
    it('should return person phone defaults from config', () => {
      const defaults = service.defaults();
      expect(defaults).toBeDefined();
      expect(defaults.idSeparator).toBe('|');
      expect(defaults.availableColumns).toContain('personFullName');
    });
  });

  describe('getPersonPhones', () => {
    it('should make GET request to get_person_phones', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      service.getPersonPhones(params).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('get_person_phones'));
      expect(req.request.method).toBe('GET');
      req.flush(mockPersonPhonesListResponse);
    });

    it('should return list of person phones from API response', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      let result: any;
      service.getPersonPhones(params).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('get_person_phones'));
      req.flush(mockPersonPhonesListResponse);
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].business_entity_id).toBe(1);
      expect(result[0].phone_number).toBe('398-4567');
      expect(result[0].phone_number_type_id).toBe(1);
    });

    it('should include filters in query string', () => {
      const params = new QueryParams(1, 10, { personIds: '1,2,3' }, null, EOrderType.ASC);
      service.getPersonPhones(params).subscribe();
      const req = httpMock.expectOne(request => {
        return request.url.includes('get_person_phones') && request.url.includes('filters=');
      });
      expect(req.request.url).toContain('person_ids:1,2,3');
      req.flush([]);
    });

    it('should include pagination parameters', () => {
      const params = new QueryParams(2, 25, null, null, EOrderType.ASC);
      service.getPersonPhones(params).subscribe();
      const req = httpMock.expectOne(request => {
        return request.url.includes('get_person_phones') && request.url.includes('offset=');
      });
      expect(req.request.url).toContain('offset=25');
      expect(req.request.url).toContain('limit=25');
      req.flush([]);
    });

    it('should handle empty response', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      let result: any;
      service.getPersonPhones(params).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('get_person_phones'));
      req.flush([]);
      expect(result).toEqual([]);
    });

    it('should handle server error', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      let error: any;
      service.getPersonPhones(params).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne(request => request.url.includes('get_person_phones'));
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      expect(error).toBeTruthy();
    });
  });

  describe('countPersonPhones', () => {
    it('should make GET request to count_person_phones', () => {
      service.countPersonPhones(null).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('count_person_phones'));
      expect(req.request.method).toBe('GET');
      req.flush({ count: 150 });
    });

    it('should return count from API response', () => {
      let result: any;
      service.countPersonPhones(null).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('count_person_phones'));
      req.flush({ count: 150 });
      expect(result.count).toBe(150);
    });

    it('should include filters when provided', () => {
      service.countPersonPhones({ personIds: '1,2' }).subscribe();
      const req = httpMock.expectOne(request => {
        return request.url.includes('count_person_phones') && request.url.includes('filters=');
      });
      expect(req.request.url).toContain('person_ids:1,2');
      req.flush({ count: 3 });
    });
  });

  describe('getPersonPhone', () => {
    it('should make GET request with composite key', () => {
      service.getPersonPhone(1, '398-4567', 1).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/get_person_phone/1/398-4567/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPersonPhoneApiResponse);
    });

    it('should return person phone data from API response', () => {
      let result: any;
      service.getPersonPhone(1, '398-4567', 1).subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/get_person_phone/1/398-4567/1');
      req.flush(mockPersonPhoneApiResponse);
      expect(result.business_entity_id).toBe(1);
      expect(result.phone_number).toBe('398-4567');
      expect(result.phone_number_type_id).toBe(1);
    });

    it('should handle special characters in phone number', () => {
      service.getPersonPhone(2, '+1-555-9876-ext123', 2).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/get_person_phone/2/+1-555-9876-ext123/2');
      expect(req.request.method).toBe('GET');
      req.flush({ business_entity_id: 2, phone_number: '+1-555-9876-ext123', phone_number_type_id: 2, modified_date: '2023-01-01T00:00:00Z' });
    });

    it('should handle 404 not found', () => {
      let error: any;
      service.getPersonPhone(999, '000-0000', 1).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/get_person_phone/999/000-0000/1');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
      expect(error).toBeTruthy();
    });
  });

  describe('createPersonPhone', () => {
    it('should make POST request to create_person_phone', () => {
      const input = new PersonPhoneInput(1, '555-1234', 2);
      service.createPersonPhone(input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/create_person_phone');
      expect(req.request.method).toBe('POST');
      req.flush({ success: true });
    });

    it('should send snake_case body structure', () => {
      const input = new PersonPhoneInput(3, '398-7654', 1);
      service.createPersonPhone(input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/create_person_phone');
      expect(req.request.body).toEqual({
        business_entity_id: 3,
        phone_number: '398-7654',
        phone_number_type_id: 1
      });
      req.flush({ success: true });
    });

    it('should handle creation error', () => {
      const input = new PersonPhoneInput(1, '555-1234', 2);
      let error: any;
      service.createPersonPhone(input).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/create_person_phone');
      req.flush('Duplicate entry', { status: 409, statusText: 'Conflict' });
      expect(error).toBeTruthy();
    });
  });

  describe('updatePersonPhone', () => {
    it('should make PUT request with composite key and body', () => {
      const input = new PersonPhoneInput(1, '555-1234', 2);
      service.updatePersonPhone(1, '555-1234', 2, input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/update_person_phone/1/555-1234/2');
      expect(req.request.method).toBe('PUT');
      req.flush({ success: true });
    });

    it('should send snake_case body structure', () => {
      const input = new PersonPhoneInput(5, '999-8888', 3);
      service.updatePersonPhone(5, '999-8888', 3, input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/update_person_phone/5/999-8888/3');
      expect(req.request.body).toEqual({
        business_entity_id: 5,
        phone_number: '999-8888',
        phone_number_type_id: 3
      });
      req.flush({ success: true });
    });
  });

  describe('deletePersonPhone', () => {
    it('should make DELETE request with composite key', () => {
      service.deletePersonPhone(1, '555-1234', 2).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/delete_person_phone/1/555-1234/2');
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });

    it('should handle delete error', () => {
      let error: any;
      service.deletePersonPhone(1, '555-1234', 2).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/delete_person_phone/1/555-1234/2');
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
      expect(error).toBeTruthy();
    });

    it('should handle delete with phone numbers containing slashes', () => {
      service.deletePersonPhone(1, '+1/555/1234', 1).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/delete_person_phone/1/+1/555/1234/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });
  });
});
