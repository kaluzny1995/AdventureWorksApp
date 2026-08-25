import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PersonPhonesFilterFormDialog } from './person-phones-filter-form-dialog';
import { PersonPhoneFilterParams } from 'src/app/models/admin-pannels/person-phones/person-phone-filter-params';
import { PersonService } from 'src/app/services/admin-pannels/person.service';
import { PhoneNumberTypeService } from 'src/app/services/admin-pannels/phone-number-type.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

describe('PersonPhonesFilterFormDialog', () => {
  let component: PersonPhonesFilterFormDialog;
  let fixture: ComponentFixture<PersonPhonesFilterFormDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PersonPhonesFilterFormDialog>>;
  let personServiceSpy: jasmine.SpyObj<PersonService>;
  let phoneTypeServiceSpy: jasmine.SpyObj<PhoneNumberTypeService>;
  let localStorageSpy: jasmine.SpyObj<LocalStorageService>;

  const mockData = new PersonPhoneFilterParams(null, null);

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    personServiceSpy = jasmine.createSpyObj('PersonService', ['getFirst10Persons', 'searchByPhrases']);
    phoneTypeServiceSpy = jasmine.createSpyObj('PhoneNumberTypeService', ['allPhoneNumberTypes']);
    localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem', 'removeItem']);

    personServiceSpy.getFirst10Persons.and.returnValue(of([]));
    personServiceSpy.searchByPhrases.and.returnValue(of([]));
    phoneTypeServiceSpy.allPhoneNumberTypes.and.returnValue(of([]));
    localStorageSpy.getItem.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [PersonPhonesFilterFormDialog, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: PersonService, useValue: personServiceSpy },
        { provide: PhoneNumberTypeService, useValue: phoneTypeServiceSpy },
        { provide: LocalStorageService, useValue: localStorageSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonPhonesFilterFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    expect(component.personIds).toBeDefined();
    expect(component.personPhrase).toBeDefined();
    expect(component.phoneNumberTypeIds).toBeDefined();
    expect(component.form).toBeDefined();
  });

  it('should close dialog on cancel()', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should reset form and remove localStorage on clear()', () => {
    component.clear();
    expect(localStorageSpy.removeItem).toHaveBeenCalledWith('personPhrase', 'person-phone');
  });

  it('should close with PersonPhoneFilterParams on filter()', () => {
    component.personIds.setValue([1, 2]);
    component.phoneNumberTypeIds.setValue([3]);
    component.filter();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.any(PersonPhoneFilterParams));
  });

  it('should load first 10 persons on init when no phrase in localStorage', () => {
    expect(personServiceSpy.getFirst10Persons).toHaveBeenCalled();
  });

  it('should load phone number types on init', () => {
    expect(phoneTypeServiceSpy.allPhoneNumberTypes).toHaveBeenCalled();
  });

  it('should search persons when phrase is longer than 2 chars', fakeAsync(() => {
    component.personPhrase.setValue('Joh');
    tick();
    expect(personServiceSpy.searchByPhrases).toHaveBeenCalled();
  }));

  it('should store personPhrase in localStorage when filter has phrase > 2 chars', () => {
    component.personPhrase.setValue('John');
    component.filter();
    expect(localStorageSpy.setItem).toHaveBeenCalledWith('personPhrase', 'John', 'person-phone');
  });

  it('should remove personPhrase from localStorage when filter phrase <= 2 chars', () => {
    component.personPhrase.setValue('Jo');
    component.filter();
    expect(localStorageSpy.removeItem).toHaveBeenCalledWith('personPhrase', 'person-phone');
  });
});
