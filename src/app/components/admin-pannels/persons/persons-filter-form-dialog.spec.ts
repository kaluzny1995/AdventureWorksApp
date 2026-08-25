import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PersonsFilterFormDialog } from './persons-filter-form-dialog';
import { PersonFilterParams } from 'src/app/models/admin-pannels/persons/person-filter-params';
import { PersonService } from 'src/app/services/admin-pannels/person.service';

describe('PersonsFilterFormDialog', () => {
  let component: PersonsFilterFormDialog;
  let fixture: ComponentFixture<PersonsFilterFormDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PersonsFilterFormDialog>>;
  let personServiceSpy: jasmine.SpyObj<PersonService>;

  const mockData = new PersonFilterParams(null, null, null);
  const mockDefaults = { types: {individual: 'Individual', store: 'Store'} };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    personServiceSpy = jasmine.createSpyObj('PersonService', ['defaults']);
    personServiceSpy.defaults.and.returnValue(mockDefaults as any);

    await TestBed.configureTestingModule({
      imports: [PersonsFilterFormDialog, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: PersonService, useValue: personServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonsFilterFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize person types from service defaults', () => {
    expect(component.personTypes).toEqual({individual: 'Individual', store: 'Store'});
  });

  it('should initialize form controls', () => {
    expect(component.personType).toBeDefined();
    expect(component.lastNamePhrase).toBeDefined();
    expect(component.firstNamePhrase).toBeDefined();
    expect(component.form).toBeDefined();
  });

  it('should close dialog on cancel()', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should reset form on clear()', () => {
    component.lastNamePhrase.setValue('Smith');
    component.clear();
    expect(component.lastNamePhrase.value).toBeNull();
  });

  it('should close with PersonFilterParams on filter()', () => {
    component.personType.setValue('Individual');
    component.lastNamePhrase.setValue('Smith');
    component.firstNamePhrase.setValue('John');
    component.filter();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.any(PersonFilterParams));
  });

  it('should pass filter values correctly', () => {
    component.personType.setValue('Store');
    component.lastNamePhrase.setValue('Jones');
    component.firstNamePhrase.setValue(null);
    component.filter();
    const result = dialogRefSpy.close.calls.mostRecent().args[0] as PersonFilterParams;
    expect(result.personType).toBe('Store');
    expect(result.lastNamePhrase).toBe('Jones');
    expect(result.firstNamePhrase).toBeNull();
  });
});
