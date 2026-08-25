import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FirstStepsComponent } from './first-steps.component';

describe('FirstStepsComponent', () => {
  let component: FirstStepsComponent;
  let fixture: ComponentFixture<FirstStepsComponent>;
  let httpMock: HttpTestingController;

  const mockFirstStepsData = {
    imagePathTemplate: '/assets/images/first_steps/${}.png',
    selectedInstruction: 'signing_up',
    instructions: [
      {
        name: 'Signing up', value: 'signing_up', btnIcon: 'person_add',
        images: [
          {title: 'Signing up form', src: 'signing_up', label: 'Empty', isHalf: true},
          {title: 'Signing up filled in form', src: 'signing_up_filled', label: 'Filled in', isHalf: true}
        ],
        steps: [
          {name: 'Username', title: 'Unique username.', description: 'Must be unique.'},
          {name: 'Password', title: 'Password typed twice.', description: 'Must be repeated.'}
        ]
      },
      {
        name: 'Signing in', value: 'signing_in', btnIcon: 'person',
        images: [{title: 'Signing in form', src: 'signing_in', label: 'Empty', isHalf: true}],
        steps: [{name: 'Username', title: 'Username.', description: 'Provide username.'}]
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [FirstStepsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FirstStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const req = httpMock.expectOne('/assets/data/instructions/first_steps.json');
    req.flush(mockFirstStepsData);
    expect(component).toBeTruthy();
  });

  it('should load instructions from /assets/data/instructions/first_steps.json', () => {
    const req = httpMock.expectOne('/assets/data/instructions/first_steps.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockFirstStepsData);
  });

  it('should parse instructions and set image paths', () => {
    const req = httpMock.expectOne('/assets/data/instructions/first_steps.json');
    req.flush(mockFirstStepsData);

    expect(component.instructions).toBeDefined();
    expect(component.instructions.length).toBe(2);
    expect(component.instructions[0].name).toBe('Signing up');
    expect(component.instructions[0].images[0].src).toBe('/assets/images/first_steps/signing_up.png');
    expect(component.instructions[0].images[1].src).toBe('/assets/images/first_steps/signing_up_filled.png');
    expect(component.instructions[1].images[0].src).toBe('/assets/images/first_steps/signing_in.png');
  });

  it('should set selectedInstruction from JSON', () => {
    const req = httpMock.expectOne('/assets/data/instructions/first_steps.json');
    req.flush(mockFirstStepsData);
    expect(component.selectedInstruction).toBeDefined();
  });

  it('should have steps parsed for each instruction', () => {
    const req = httpMock.expectOne('/assets/data/instructions/first_steps.json');
    req.flush(mockFirstStepsData);

    expect(component.instructions[0].steps.length).toBe(2);
    expect(component.instructions[0].steps[0].title).toBe('Unique username.');
    expect(component.instructions[1].steps.length).toBe(1);
  });

  it('should select instruction', () => {
    const req = httpMock.expectOne('/assets/data/instructions/first_steps.json');
    req.flush(mockFirstStepsData);

    component.selectInstruction(component.instructions[1].value as any);
    expect(component.selectedInstruction).toBe(component.instructions[1].value);
  });
});
