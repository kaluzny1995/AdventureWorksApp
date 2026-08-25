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

  beforeEach(() => {
    const appConfig = {
      apiUrl: 'http://localhost:8080/',
      personPhoneDefaults: {
        idSeparator: '/',
        availableColumns: [],
        availableColumnNames: [],
        displayedIndices: [],
        availableFilters: [],
        availableFilterNames: []
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

  describe('getPersonPhones', () => {
    it('should make GET request with query params', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      service.getPersonPhones(params).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('get_person_phones'));
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('countPersonPhones', () => {
    it('should make GET request with filters', () => {
      service.countPersonPhones(null).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('count_person_phones'));
      expect(req.request.method).toBe('GET');
      req.flush({count: 0});
    });
  });

  describe('getPersonPhone', () => {
    it('should make GET request with composite key', () => {
      service.getPersonPhone(1, '555-1234', 2).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/get_person_phone/1/555-1234/2');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });

  describe('createPersonPhone', () => {
    it('should make POST request with body', () => {
      const input = new PersonPhoneInput(1, '555-1234', 2);
      service.createPersonPhone(input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/create_person_phone');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        business_entity_id: 1,
        phone_number: '555-1234',
        phone_number_type_id: 2
      });
      req.flush({success: true});
    });
  });

  describe('updatePersonPhone', () => {
    it('should make PUT request with composite key and body', () => {
      const input = new PersonPhoneInput(1, '555-1234', 2);
      service.updatePersonPhone(1, '555-1234', 2, input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/update_person_phone/1/555-1234/2');
      expect(req.request.method).toBe('PUT');
      req.flush({success: true});
    });
  });

  describe('deletePersonPhone', () => {
    it('should make DELETE request with composite key', () => {
      service.deletePersonPhone(1, '555-1234', 2).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/delete_person_phone/1/555-1234/2');
      expect(req.request.method).toBe('DELETE');
      req.flush({success: true});
    });
  });
});
