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

  const mockPersonApiResponse = {
    business_entity_id: 1,
    person_type: 'IN',
    name_style: 'False',
    title: 'Mr.',
    first_name: 'John',
    middle_name: 'A',
    last_name: 'Doe',
    suffix: null,
    email_promotion: 0,
    additional_contact_info: '<Address><AddressType>Home</AddressType></Address>',
    demographics: '<IndividualSurvey><TotalPurchaseYTD>0</TotalPurchaseYTD></IndividualSurvey>',
    rowguid: '12345678-1234-1234-1234-123456789abc',
    modified_date: '2023-01-15T10:30:00Z'
  };

  const mockPersonsListResponse = [
    mockPersonApiResponse,
    {
      business_entity_id: 2,
      person_type: 'EM',
      name_style: 'False',
      title: null,
      first_name: 'Jane',
      middle_name: null,
      last_name: 'Smith',
      suffix: null,
      email_promotion: 1,
      additional_contact_info: null,
      demographics: null,
      rowguid: '87654321-4321-4321-4321-cba987654321',
      modified_date: '2023-06-20T14:00:00Z'
    }
  ];

  beforeEach(() => {
    const appConfig = {
      apiUrl: 'http://localhost:8080/',
      personDefaults: {
        availableColumns: ['personId', 'personType', 'firstName', 'lastName'],
        availableColumnNames: ['ID', 'Type', 'First Name', 'Last Name'],
        displayedIndices: [0, 2, 3],
        availableFilters: ['personType', 'lastNamePhrase'],
        availableFilterNames: ['Person Type', 'Last Name'],
        types: { GC: 'Store Contact', IN: 'Individual', EM: 'Employee' },
        nameStyles: { '0': 'western', '1': 'eastern' },
        titles: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'],
        suffixes: ['Jr.', 'Sr.', 'II'],
        emailPromotions: { '0': 'No promotions', '1': 'Allow AB', '2': 'Allow AB+AC' },
        aciTemplate: '<address><AddressType>Home</AddressType></address>',
        demoTemplate: '<demographics><lang>English</lang></demographics>'
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

  describe('defaults', () => {
    it('should return person defaults from config', () => {
      const defaults = service.defaults();
      expect(defaults).toBeDefined();
      expect(defaults.availableColumns).toContain('personId');
      expect(defaults.types['IN']).toBe('Individual');
    });
  });

  describe('getPersons', () => {
    it('should make GET request to get_persons with default query params', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      service.getPersons(params).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('get_persons'));
      expect(req.request.method).toBe('GET');
      req.flush(mockPersonsListResponse);
    });

    it('should return parsed person list from API response', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      let result: any;
      service.getPersons(params).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('get_persons'));
      req.flush(mockPersonsListResponse);
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].business_entity_id).toBe(1);
      expect(result[0].person_type).toBe('IN');
      expect(result[0].first_name).toBe('John');
      expect(result[0].last_name).toBe('Doe');
      expect(result[1].first_name).toBe('Jane');
    });

    it('should include filters in query string when provided', () => {
      const params = new QueryParams(1, 10, { personType: 'IN' }, null, EOrderType.ASC);
      service.getPersons(params).subscribe();
      const req = httpMock.expectOne(request => {
        const url = request.url;
        return url.includes('get_persons') && url.includes('filters=');
      });
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toContain('person_type:IN');
      req.flush([]);
    });

    it('should include order_by in query string when provided', () => {
      const params = new QueryParams(1, 10, null, 'firstName', EOrderType.ASC);
      service.getPersons(params).subscribe();
      const req = httpMock.expectOne(request => {
        const url = request.url;
        return url.includes('get_persons') && url.includes('order_by=');
      });
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toContain('order_by=first_name');
      req.flush([]);
    });

    it('should include offset and limit for pagination', () => {
      const params = new QueryParams(3, 20, null, null, EOrderType.ASC);
      service.getPersons(params).subscribe();
      const req = httpMock.expectOne(request => {
        const url = request.url;
        return url.includes('get_persons') && url.includes('offset=') && url.includes('limit=');
      });
      expect(req.request.url).toContain('offset=40');
      expect(req.request.url).toContain('limit=20');
      req.flush([]);
    });

    it('should include order_type when different from default', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.DESC);
      service.getPersons(params).subscribe();
      const req = httpMock.expectOne(request => {
        return request.url.includes('get_persons') && request.url.includes('order_type=desc');
      });
      req.flush([]);
    });

    it('should handle empty response', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      let result: any;
      service.getPersons(params).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('get_persons'));
      req.flush([]);
      expect(result).toEqual([]);
    });

    it('should handle API error response', () => {
      const params = new QueryParams(1, 10, null, null, EOrderType.ASC);
      let error: any;
      service.getPersons(params).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne(request => request.url.includes('get_persons'));
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      expect(error).toBeTruthy();
    });
  });

  describe('countPersons', () => {
    it('should make GET request to count_persons', () => {
      service.countPersons(null).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('count_persons'));
      expect(req.request.method).toBe('GET');
      req.flush({ count: 42 });
    });

    it('should return count from API response', () => {
      let result: any;
      service.countPersons(null).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('count_persons'));
      req.flush({ count: 42 });
      expect(result.count).toBe(42);
    });

    it('should include filters when provided', () => {
      service.countPersons({ personType: 'EM' }).subscribe();
      const req = httpMock.expectOne(request => {
        return request.url.includes('count_persons') && request.url.includes('filters=');
      });
      expect(req.request.url).toContain('person_type:EM');
      req.flush({ count: 5 });
    });

    it('should handle null filters', () => {
      let result: any;
      service.countPersons(null).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('count_persons'));
      req.flush({ count: 0 });
      expect(result.count).toBe(0);
    });
  });

  describe('getPerson', () => {
    it('should make GET request to get_person/{id}', () => {
      service.getPerson(1).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/get_person/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPersonApiResponse);
    });

    it('should return person data from API response', () => {
      let result: any;
      service.getPerson(1).subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/get_person/1');
      req.flush(mockPersonApiResponse);
      expect(result.business_entity_id).toBe(1);
      expect(result.person_type).toBe('IN');
      expect(result.first_name).toBe('John');
      expect(result.last_name).toBe('Doe');
      expect(result.title).toBe('Mr.');
    });

    it('should handle person with null optional fields', () => {
      const minimalPerson = {
        business_entity_id: 3,
        person_type: 'VC',
        name_style: 'False',
        title: null,
        first_name: 'Bob',
        middle_name: null,
        last_name: 'Builder',
        suffix: null,
        email_promotion: 0,
        additional_contact_info: null,
        demographics: null,
        rowguid: 'abcdef-1234-5678-9abc-def012345678',
        modified_date: '2023-09-01T08:00:00Z'
      };
      let result: any;
      service.getPerson(3).subscribe(data => result = data);
      const req = httpMock.expectOne('http://localhost:8080/get_person/3');
      req.flush(minimalPerson);
      expect(result.title).toBeNull();
      expect(result.middle_name).toBeNull();
      expect(result.additional_contact_info).toBeNull();
    });

    it('should handle 404 not found', () => {
      let error: any;
      service.getPerson(999).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/get_person/999');
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
      expect(error).toBeTruthy();
    });
  });

  describe('createPerson', () => {
    it('should make POST request to create_person', () => {
      const input = new PersonInput(
        EPersonType.GC, 'False', 'Mr.',
        'John', 'A', 'Doe', 'Jr.',
        0, null, null
      );
      service.createPerson(input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/create_person');
      expect(req.request.method).toBe('POST');
      req.flush({ success: true, id: 100 });
    });

    it('should send snake_case body structure', () => {
      const input = new PersonInput(
        EPersonType.IN, 'False', null,
        'Jane', 'M', 'Smith', null,
        1, null, null
      );
      service.createPerson(input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/create_person');
      expect(req.request.body).toEqual({
        person_type: 'IN',
        name_style: 'False',
        title: null,
        first_name: 'Jane',
        middle_name: 'M',
        last_name: 'Smith',
        suffix: null,
        email_promotion: 1,
        additional_contact_info: null,
        demographics: null
      });
      req.flush({ success: true });
    });

    it('should handle creation error', () => {
      const input = new PersonInput(
        EPersonType.GC, 'False', null,
        'John', null, 'Doe', null,
        0, null, null
      );
      let error: any;
      service.createPerson(input).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/create_person');
      req.flush('Validation error', { status: 422, statusText: 'Unprocessable Entity' });
      expect(error).toBeTruthy();
    });
  });

  describe('updatePerson', () => {
    it('should make PUT request to update_person/{id}', () => {
      const input = new PersonInput(
        EPersonType.GC, 'False', 'Dr.',
        'John', 'A', 'Doe', 'Sr.',
        0, null, null
      );
      service.updatePerson(1, input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/update_person/1');
      expect(req.request.method).toBe('PUT');
      req.flush({ success: true });
    });

    it('should send snake_case body structure with id', () => {
      const input = new PersonInput(
        EPersonType.EM, 'True', null,
        'Alice', null, 'Wonder', null,
        2, '<phone>123</phone>', null
      );
      service.updatePerson(5, input).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/update_person/5');
      expect(req.request.body).toEqual({
        person_type: 'EM',
        name_style: 'True',
        title: null,
        first_name: 'Alice',
        middle_name: null,
        last_name: 'Wonder',
        suffix: null,
        email_promotion: 2,
        additional_contact_info: '<phone>123</phone>',
        demographics: null
      });
      req.flush({ success: true });
    });
  });

  describe('deletePerson', () => {
    it('should make DELETE request to delete_person/{id}', () => {
      service.deletePerson(1).subscribe();
      const req = httpMock.expectOne('http://localhost:8080/delete_person/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true });
    });

    it('should handle delete error', () => {
      let error: any;
      service.deletePerson(1).subscribe({
        next: () => fail('Expected error'),
        error: (e) => error = e
      });
      const req = httpMock.expectOne('http://localhost:8080/delete_person/1');
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
      expect(error).toBeTruthy();
    });
  });

  describe('getFirst10Persons', () => {
    it('should make GET request with limit=10', () => {
      service.getFirst10Persons().subscribe();
      const req = httpMock.expectOne(request => {
        return request.url.includes('get_persons') && request.url.includes('limit=10');
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockPersonsListResponse);
    });

    it('should return list of persons', () => {
      let result: any;
      service.getFirst10Persons().subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('get_persons'));
      req.flush(mockPersonsListResponse);
      expect(result.length).toBe(2);
    });

    it('should handle empty result', () => {
      let result: any;
      service.getFirst10Persons().subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('get_persons'));
      req.flush([]);
      expect(result).toEqual([]);
    });
  });

  describe('searchByPhrases', () => {
    it('should make GET request with search params', () => {
      service.searchByPhrases('John', 'Doe', true).subscribe();
      const req = httpMock.expectOne(request => {
        return request.url.includes('search_by_phrases');
      });
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toContain('first_name_phrase=John');
      expect(req.request.url).toContain('last_name_phrase=Doe');
      expect(req.request.url).toContain('is_ordered=true');
      req.flush([mockPersonApiResponse]);
    });

    it('should return matching persons', () => {
      let result: any;
      service.searchByPhrases('Jane', 'Smith', false).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('search_by_phrases'));
      req.flush([mockPersonsListResponse[1]]);
      expect(result.length).toBe(1);
      expect(result[0].first_name).toBe('Jane');
    });

    it('should handle null search phrases', () => {
      service.searchByPhrases(null, null, null).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('search_by_phrases'));
      expect(req.request.url).toContain('first_name_phrase=null');
      expect(req.request.url).toContain('last_name_phrase=null');
      req.flush([]);
    });

    it('should always include is_alternative=true and is_raised_error_if_empty=false', () => {
      service.searchByPhrases('test', 'test', true).subscribe();
      const req = httpMock.expectOne(request => request.url.includes('search_by_phrases'));
      expect(req.request.url).toContain('is_alternative=true');
      expect(req.request.url).toContain('is_raised_error_if_empty=false');
      req.flush([]);
    });

    it('should handle empty search results', () => {
      let result: any;
      service.searchByPhrases('Nonexistent', 'Person', true).subscribe(data => result = data);
      const req = httpMock.expectOne(request => request.url.includes('search_by_phrases'));
      req.flush([]);
      expect(result).toEqual([]);
    });
  });
});
