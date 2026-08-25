import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PersonService } from './person.service';
import { AppConfigService } from '../utils/app-config.service';
import { QueryParamsService } from '../url/query-params.service';
import { UrlProcessingService } from '../url/url-processing.service';
import { FilterParamsService } from '../url/filter-params.service';
import { QueryParams } from 'src/app/models/admin-pannels/common/query-params';
import { EOrderType } from 'src/app/models/admin-pannels/common/e-order-type';
import { PersonInput } from 'src/app/models/admin-pannels/persons/person';
import { EPersonType } from 'src/app/models/admin-pannels/persons/e-person-type';

describe('PersonService', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const appConfig = {
      apiUrl: 'http://localhost:8080/',
      personDefaults: {
        availableColumns: [],
        availableColumnNames: [],
        displayedIndices: [],
        availableFilters: [],
        availableFilterNames: [],
        types: [],
        nameStyles: [],
        titles: [],
        suffixes: [],
        emailPromotions: [],
        aciTemplate: '',
        demoTemplate: ''
      },
      defaultQueryParams: new QueryParams(1, 10, null, null, EOrderType.ASC)
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PersonService,
        QueryParamsService,
        UrlProcessingService,
        FilterParamsService,
        { provide: AppConfigService, useValue: appConfig }
      ]
    });
    service = TestBed.inject(PersonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPersons', () => {
    it('should make GET request with query params', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      service.getPersons(params).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('get_persons'));
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('countPersons', () => {
    it('should make GET request with filters', () => {
      service.countPersons(null).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('count_persons'));
      expect(req.request.method).toBe('GET');
      req.flush({count: 0});
    });
  });

  describe('getPerson', () => {
    it('should make GET request by id', () => {
      service.getPerson(1).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/get_person/1');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });

  describe('createPerson', () => {
    it('should make POST request with body', () => {
      const input = new PersonInput(
        EPersonType.GC, 'False', null,
        'John', null, 'Doe', null,
        0, null, null
      );
      service.createPerson(input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/create_person');
      expect(req.request.method).toBe('POST');
      req.flush({success: true});
    });
  });

  describe('updatePerson', () => {
    it('should make PUT request with id and body', () => {
      const input = new PersonInput(
        EPersonType.GC, 'False', null,
        'John', null, 'Doe', null,
        0, null, null
      );
      service.updatePerson(1, input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/update_person/1');
      expect(req.request.method).toBe('PUT');
      req.flush({success: true});
    });
  });

  describe('deletePerson', () => {
    it('should make DELETE request by id', () => {
      service.deletePerson(1).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/delete_person/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({success: true});
    });
  });

  describe('getFirst10Persons', () => {
    it('should make GET request with limit=10', () => {
      service.getFirst10Persons().subscribe();
      const req = httpMock.expectOne(request => request.url.includes('get_persons') && request.url.includes('limit=10'));
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('searchByPhrases', () => {
    it('should make GET request with search params', () => {
      service.searchByPhrases('John', 'Doe', true).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('search_by_phrases'));
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });
});
