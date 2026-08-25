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

  beforeEach(() => {
    appConfig = {
      apiUrl: 'http://localhost:8080/',
      phoneNumberTypeDefaults: {
        availableFilters: [],
        availableFilterNames: [],
        newId: 0,
        perPage: 10
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
    it('should return defaults from config', () => {
      expect(service.defaults()).toBe(appConfig.phoneNumberTypeDefaults);
    });
  });

  describe('getPhoneNumberTypes', () => {
    it('should make GET request', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      service.getPhoneNumberTypes(params).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('get_phone_number_types'));
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('countPhoneNumberTypes', () => {
    it('should make GET request with filters', () => {
      service.countPhoneNumberTypes(null).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('count_phone_number_types'));
      expect(req.request.method).toBe('GET');
      req.flush({count: 0});
    });
  });

  describe('getPhoneNumberType', () => {
    it('should make GET request by id', () => {
      service.getPhoneNumberType(1).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/get_phone_number_type/1');
      expect(req.request.method).toBe('GET');
      req.flush({phone_number_type_id: 1});
    });
  });

  describe('createPhoneNumberType', () => {
    it('should make POST request with body', () => {
      const input = new PhoneNumberTypeInput('Home');
      service.createPhoneNumberType(input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/create_phone_number_type');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({name: 'Home'});
      req.flush({success: true});
    });
  });

  describe('updatePhoneNumberType', () => {
    it('should make PUT request with id and body', () => {
      const input = new PhoneNumberTypeInput('Work');
      service.updatePhoneNumberType(1, input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/update_phone_number_type/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({name: 'Work'});
      req.flush({success: true});
    });
  });

  describe('deletePhoneNumberType', () => {
    it('should make DELETE request by id', () => {
      service.deletePhoneNumberType(1).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/delete_phone_number_type/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({success: true});
    });
  });

  describe('allPhoneNumberTypes', () => {
    it('should make GET request with limit=100', () => {
      service.allPhoneNumberTypes().subscribe();
      const req = httpMock.expectOne(request => request.url.includes('get_phone_number_types') && request.url.includes('limit=100'));
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });
});
