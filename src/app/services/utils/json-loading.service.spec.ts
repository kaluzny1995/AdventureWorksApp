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

    it('should load all 5 entity types from correct paths', () => {
      const entities = ['person', 'person_phone', 'phone_number_type', 'sales_territory', 'state_province'];
      entities.forEach(entity => {
        service.loadEntityDescription(entity).subscribe();
        httpMock.expectOne(`/assets/data/entities/${entity}.json`);
      });
    });

    it('should return entity with name, description, and fields', () => {
      const mockEntity = {
        name: 'Person',
        description: 'Human beings involved with AdventureWorks.',
        fields: [
          {name: 'BusinessEntityID', type: 'int', description: 'Primary key.', primary: true, unique: true},
          {name: 'PersonType', type: 'nchar(2)', description: 'Primary type of person.'}
        ]
      };
      service.loadEntityDescription('person').subscribe(data => {
        expect(data.name).toBe('Person');
        expect(data.description).toBeDefined();
        expect(data.fields.length).toBe(2);
        expect(data.fields[0].name).toBe('BusinessEntityID');
        expect(data.fields[0].primary).toBeTrue();
      });
      const req = httpMock.expectOne('/assets/data/entities/person.json');
      req.flush(mockEntity);
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

    it('should load instruction with imagePathTemplate, selectedInstruction, and instructions array', () => {
      const mockInstruction = {
        imagePathTemplate: '/assets/images/first_steps/${}.png',
        selectedInstruction: 'signing_up',
        instructions: [
          {
            name: 'Signing up',
            value: 'signing_up',
            btnIcon: 'person_add',
            images: [{title: 'Form', src: 'signing_up', label: 'Empty', isHalf: true}],
            steps: [{name: 'Username', title: 'Unique username.', description: 'Must be unique.'}]
          }
        ]
      };
      service.loadInstruction('first-steps').subscribe(data => {
        expect(data.imagePathTemplate).toBe('/assets/images/first_steps/${}.png');
        expect(data.selectedInstruction).toBe('signing_up');
        expect(data.instructions.length).toBe(1);
        expect(data.instructions[0].name).toBe('Signing up');
        expect(data.instructions[0].images[0].src).toBe('signing_up');
      });
      const req = httpMock.expectOne('/assets/data/instructions/first-steps.json');
      req.flush(mockInstruction);
    });

    it('should load all 4 instruction files from correct paths', () => {
      const instructionFiles = ['first_steps', 'admin_pannels', '1v_admin_pannels', 'dataflow_diagrams'];
      instructionFiles.forEach(file => {
        service.loadInstruction(file).subscribe();
        httpMock.expectOne(`/assets/data/instructions/${file}.json`).flush({});
      });
    });

    it('should resolve image paths using imagePathTemplate', () => {
      const template = '/assets/images/first_steps/${}.png';
      const imageSrc = 'signing_up';
      const resolved = template.replace('${}', imageSrc);
      expect(resolved).toBe('/assets/images/first_steps/signing_up.png');
    });
  });
});
