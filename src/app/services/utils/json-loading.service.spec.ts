import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JsonLoadingService } from './json-loading.service';

describe('JsonLoadingService', () => {
  let service: JsonLoadingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(JsonLoadingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadEntityDescription', () => {
    it('should make GET request to correct URL', () => {
      service.loadEntityDescription('person').subscribe();
      const req = httpMock.expectOne('/assets/data/entities/person.json');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should return Observable of response', () => {
      const mockData = {name: 'Person', fields: []};
      service.loadEntityDescription('person').subscribe(data => {
        expect(data).toEqual(mockData);
      });
      const req = httpMock.expectOne('/assets/data/entities/person.json');
      req.flush(mockData);
    });
  });

  describe('loadInstruction', () => {
    it('should make GET request to correct URL', () => {
      service.loadInstruction('first-steps').subscribe();
      const req = httpMock.expectOne('/assets/data/instructions/first-steps.json');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should return Observable of response', () => {
      const mockData = {name: 'First Steps', steps: []};
      service.loadInstruction('first-steps').subscribe(data => {
        expect(data).toEqual(mockData);
      });
      const req = httpMock.expectOne('/assets/data/instructions/first-steps.json');
      req.flush(mockData);
    });
  });
});
