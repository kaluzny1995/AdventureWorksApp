import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PhoneNumberTypeService } from './phone-number-type.service';
import { AppConfigService } from '../utils/app-config.service';
import { QueryParamsService } from '../url/query-params.service';
import { UrlProcessingService } from '../url/url-processing.service';
import { FilterParamsService } from '../url/filter-params.service';
import { QueryParams } from 'src/app/models/admin-pannels/common/query-params';
import { EOrderType } from 'src/app/models/admin-pannels/common/e-order-type';
import { PhoneNumberTypeInput } from 'src/app/models/admin-pannels/phone-number-types/phone-number-type';

describe('PhoneNumberTypeService', () => {
  let service: PhoneNumberTypeService;
  let httpMock: HttpTestingController;
  let appConfig: any;

  const mockPhoneNumberTypeApiResponse = {
    phone_number_type_id: 1,
    name: 'Cell',
    modified_date: '2009-01-01T00:00:00Z'
  };

  const mockPhoneNumberTypesListResponse = [
    mockPhoneNumberTypeApiResponse,
    {
      phone_number_type_id: 2,
      name: 'Home',
      modified_date: '2009-01-01T00:00:00Z'
    },
    {
      phone_number_type_id: 3,
      name: 'Work',
      modified_date: '2009-01-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    appConfig = {
      apiUrl: 'http://localhost:8080/',
      phoneNumberTypeDefaults: {
        availableFilters: ['namePhrase'],
        availableFilterNames: ['Name phrase'],
        newId: -1,
        perPage: 100
      },
      defaultQueryParams: new QueryParams(1, 10, null, null, EOrderType.ASC)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PhoneNumberTypeService,
        QueryParamsService,
        UrlProcessingService,
        FilterParamsService,
        { provide: AppConfigService, useValue: appConfig }
      ]
    });
    service = TestBed.inject(PhoneNumberTypeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('defaults', () => {
    it('should return phone number type defaults from config', () => {
      const defaults = service.defaults();
      expect(defaults).toBeDefined();
      expect(defaults.availableFilters).toContain('namePhrase');
      expect(defaults.newId).toBe(-1);
      expect(defaults.perPage).toBe(100);
    });
  });

  describe('getPhoneNumberTypes', () => {
    it('should make GET request to get_phone_number_types', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      service.getPhoneNumberTypes(params).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('get_phone_number_types'));
      expect(req.request.method).toBe('GET');
      req.flush(mockPhoneNumberTypesListResponse);
    });

    it('should return list of phone number types from API response', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      let result: any;
      service.getPhoneNumberTypes(params).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('get_phone_number_types'));
      req.flush(mockPhoneNumberTypesListResponse);
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].phone_number_type_id).toBe(1);
      expect(result[0].name).toBe('Cell');
      expect(result[2].name).toBe('Work');
    });

    it('should include filters in query string', () => {
      const params = new QueryParams(1, 10, { namePhrase: 'Cell' }, null, EOrderType.ASC);
      service.getPhoneNumberTypes(params).subscribe();
      const req = httpMock.expectOne(request => {
        return request.url.includes('get_phone_number_types') && request.url.includes('filters=');
      });
      expect(req.request.url).toContain('name_phrase:Cell');
      req.flush([]);
    });

    it('should include ordering parameters', () => {
      const params = new QueryParams(1, 10, null, 'name', EOrderType.DESC);
      service.getPhoneNumberTypes(params).subscribe();
      const req = httpMock.expectOne(request => {
        return request.url.includes('get_phone_number_types') && request.url.includes('order_by=');
      });
      expect(req.request.url).toContain('order_by=name');
      expect(req.request.url).toContain('order_type=desc');
      req.flush([]);
    });

    it('should handle empty response', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      let result: any;
      service.getPhoneNumberTypes(params).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('get_phone_number_types'));
      req.flush([]);
      expect(result).toEqual([]);
    });

    it('should handle server error', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      let error: any;
      service.getPhoneNumberTypes(params).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne(request => request.url.includes('get_phone_number_types'));
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      expect(error).toBeTruthy();
    });
  });

  describe('countPhoneNumberTypes', () => {
    it('should make GET request to count_phone_number_types', () => {
      service.countPhoneNumberTypes(null).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('count_phone_number_types'));
      expect(req.request.method).toBe('GET');
      req.flush({ count: 3 });
    });

    it('should return count from API response', () => {
      let result: any;
      service.countPhoneNumberTypes(null).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('count_phone_number_types'));
      req.flush({ count: 3 });
      expect(result.count).toBe(3);
    });

    it('should include filters when provided', () => {
      service.countPhoneNumberTypes({ namePhrase: 'Home' }).subscribe();
      const req = httpMock.expectOne(request => {
        return request.url.includes('count_phone_number_types') && request.url.includes('filters=');
      });
      expect(req.request.url).toContain('name_phrase:Home');
      req.flush({ count: 1 });
    });
  });

  describe('getPhoneNumberType', () => {
    it('should make GET request by id', () => {
      service.getPhoneNumberType(1).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/get_phone_number_type/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPhoneNumberTypeApiResponse);
    });

    it('should return phone number type data from API response', () => {
      let result: any;
      service.getPhoneNumberType(1).subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/get_phone_number_type/1');
      req.flush(mockPhoneNumberTypeApiResponse);
      expect(result.phone_number_type_id).toBe(1);
      expect(result.name).toBe('Cell');
      expect(result.modified_date).toBeDefined();
    });

    it('should handle different phone type ids', () => {
      service.getPhoneNumberType(3).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/get_phone_number_type/3');
      expect(req.request.url).toContain('/3');
      req.flush({ phone_number_type_id: 3, name: 'Work', modified_date: '2009-01-01T00:00:00Z' });
    });

    it('should handle 404 not found', () => {
      let error: any;
      service.getPhoneNumberType(999).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/get_phone_number_type/999');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
      expect(error).toBeTruthy();
    });
  });

  describe('createPhoneNumberType', () => {
    it('should make POST request to create_phone_number_type', () => {
      const input = new PhoneNumberTypeInput('Fax');
      service.createPhoneNumberType(input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/create_phone_number_type');
      expect(req.request.method).toBe('POST');
      req.flush({ success: true, id: 4 });
    });

    it('should send body with name field', () => {
      const input = new PhoneNumberTypeInput('Pager');
      service.createPhoneNumberType(input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/create_phone_number_type');
      expect(req.request.body).toEqual({ name: 'Pager' });
      req.flush({ success: true });
    });

    it('should handle creation error', () => {
      const input = new PhoneNumberTypeInput('Cell');
      let error: any;
      service.createPhoneNumberType(input).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/create_phone_number_type');
      req.flush('Duplicate name', { status: 409, statusText: 'Conflict' });
      expect(error).toBeTruthy();
    });
  });

  describe('updatePhoneNumberType', () => {
    it('should make PUT request with id and body', () => {
      const input = new PhoneNumberTypeInput('Mobile');
      service.updatePhoneNumberType(1, input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/update_phone_number_type/1');
      expect(req.request.method).toBe('PUT');
      req.flush({ success: true });
    });

    it('should send body with updated name', () => {
      const input = new PhoneNumberTypeInput('Home Phone');
      service.updatePhoneNumberType(2, input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/update_phone_number_type/2');
      expect(req.request.body).toEqual({ name: 'Home Phone' });
      req.flush({ success: true });
    });

    it('should handle update error', () => {
      const input = new PhoneNumberTypeInput('');
      let error: any;
      service.updatePhoneNumberType(1, input).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/update_phone_number_type/1');
      req.flush('Validation error', { status: 422, statusText: 'Unprocessable Entity' });
      expect(error).toBeTruthy();
    });
  });

  describe('deletePhoneNumberType', () => {
    it('should make DELETE request by id', () => {
      service.deletePhoneNumberType(1).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/delete_phone_number_type/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });

    it('should handle delete error', () => {
      let error: any;
      service.deletePhoneNumberType(1).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/delete_phone_number_type/1');
      req.flush('Cannot delete - in use', { status: 409, statusText: 'Conflict' });
      expect(error).toBeTruthy();
    });
  });

  describe('allPhoneNumberTypes', () => {
    it('should make GET request with limit=100', () => {
      service.allPhoneNumberTypes().subscribe();
      const req = httpMock.expectOne(request => {
        return request.url.includes('get_phone_number_types') && request.url.includes('limit=100');
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockPhoneNumberTypesListResponse);
    });

    it('should return all phone number types', () => {
      let result: any;
      service.allPhoneNumberTypes().subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('get_phone_number_types'));
      req.flush(mockPhoneNumberTypesListResponse);
      expect(result.length).toBe(3);
      expect(result.map((t: any) => t.name)).toEqual(['Cell', 'Home', 'Work']);
    });

    it('should handle empty result', () => {
      let result: any;
      service.allPhoneNumberTypes().subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('get_phone_number_types'));
      req.flush([]);
      expect(result).toEqual([]);
    });
  });
});
