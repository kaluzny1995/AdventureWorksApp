import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { XMLEditorDialog } from './xml-editor-dialog';
import { XmlEditorData } from 'src/app/models/utils/xml-editor-data';
import { EXmlField } from 'src/app/models/utils/e-xml-field';
import { PersonService } from 'src/app/services/admin-pannels/person.service';
import { FormValidationService } from 'src/app/services/utils/form-validation.service';
import { PersonDefaults } from 'src/app/models/admin-pannels/persons/person-defaults';

describe('XMLEditorDialog', () => {
  let component: XMLEditorDialog;
  let fixture: ComponentFixture<XMLEditorDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<XMLEditorDialog>>;
  let personServiceSpy: jasmine.SpyObj<PersonService>;

  const mockDefaults = new PersonDefaults(
    [], [], [], [], [], {}, {}, [], [], {}, '<aci/>', '<demo/>'
  );
  const mockData = new XmlEditorData(EXmlField.PERSON_ACI, 'Person', '<root/>');

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    personServiceSpy = jasmine.createSpyObj('PersonService', ['defaults']);
    personServiceSpy.defaults.and.returnValue(mockDefaults);

    await TestBed.configureTestingModule({
      imports: [XMLEditorDialog, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: PersonService, useValue: personServiceSpy },
        FormValidationService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(XMLEditorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with data xml', () => {
    expect(component.xml.value).toBe('<root/>');
  });

  it('should load ACI template when field is PERSON_ACI', () => {
    component.loadTemplate();
    expect(component.xml.value).toBe('<aci/>');
  });

  it('should load DEMO template when field is PERSON_DEMO', () => {
    component.data = new XmlEditorData(EXmlField.PERSON_DEMO, 'Person', '');
    component.loadTemplate();
    expect(component.xml.value).toBe('<demo/>');
  });

  it('should close dialog on cancel()', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should reset form on clear()', () => {
    component.clear();
    expect(component.xml.value).toBeNull();
  });

  it('should close with form value on submit()', () => {
    component.submit();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({xml: '<root/>'});
  });

  it('should load person defaults', () => {
    expect(component.personDefaults).toBe(mockDefaults);
  });
});
