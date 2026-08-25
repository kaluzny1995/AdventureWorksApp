import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DataflowDiagramsComponent } from './dataflow-diagrams.component';

describe('DataflowDiagramsComponent', () => {
  let component: DataflowDiagramsComponent;
  let fixture: ComponentFixture<DataflowDiagramsComponent>;
  let httpMock: HttpTestingController;

  const mockDataflowData = {
    imagePathTemplate: '/assets/images/dataflow_diagrams/${}.png',
    selectedInstruction: 'app',
    instructions: [
      {
        name: 'Application frontend', value: 'app', btnIcon: '',
        images: [{title: 'Frontend dataflow', src: 'awma_frontend', label: '', isHalf: false}],
        steps: [{name: 'Form view', title: 'User opens form.', description: 'User opens form.'}]
      },
      {
        name: 'API backend', value: 'api', btnIcon: '',
        images: [{title: 'Backend dataflow', src: 'awma_backend', label: '', isHalf: false}],
        steps: [{name: 'HTTP request', title: 'HTTP request.', description: 'HTTP request.'}]
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [DataflowDiagramsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DataflowDiagramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const req = httpMock.expectOne('/assets/data/instructions/dataflow_diagrams.json');
    req.flush(mockDataflowData);
    expect(component).toBeTruthy();
  });

  it('should load instructions from /assets/data/instructions/dataflow_diagrams.json', () => {
    const req = httpMock.expectOne('/assets/data/instructions/dataflow_diagrams.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockDataflowData);
  });

  it('should parse instructions and resolve image paths', () => {
    const req = httpMock.expectOne('/assets/data/instructions/dataflow_diagrams.json');
    req.flush(mockDataflowData);

    expect(component.instructions.length).toBe(2);
    expect(component.instructions[0].images[0].src).toBe('/assets/images/dataflow_diagrams/awma_frontend.png');
    expect(component.instructions[1].images[0].src).toBe('/assets/images/dataflow_diagrams/awma_backend.png');
  });

  it('should set selectedInstruction from JSON', () => {
    const req = httpMock.expectOne('/assets/data/instructions/dataflow_diagrams.json');
    req.flush(mockDataflowData);
    expect(component.selectedInstruction).toBeDefined();
  });
});
