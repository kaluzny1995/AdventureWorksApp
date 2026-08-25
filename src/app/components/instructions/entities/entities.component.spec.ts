import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EntitiesComponent } from './entities.component';

describe('EntitiesComponent', () => {
  let component: EntitiesComponent;
  let fixture: ComponentFixture<EntitiesComponent>;
  let httpMock: HttpTestingController;

  const mockPersonEntity = {
    name: 'Person',
    description: 'Human beings involved with AdventureWorks: employees, customer contacts, and vendor contacts.',
    fields: [
      {name: 'BusinessEntityID', type: 'int', description: 'Primary key for Person records.', primary: true, unique: true},
      {name: 'PersonType', type: 'nchar(2)', description: 'Primary type of person.'},
      {name: 'FirstName', type: 'nvarchar(50)', description: 'First name of the person.'},
      {name: 'LastName', type: 'nvarchar(50)', description: 'Last name of the person.'}
    ]
  };

  function setupComponent(): void {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EntitiesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(EntitiesComponent);
    component = fixture.componentInstance;
  }

  function flushInitialRequest(): void {
    const req = httpMock.expectOne('/assets/data/entities/person.json');
    req.flush(mockPersonEntity);
    tick();
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', fakeAsync(() => {
    setupComponent();
    fixture.detectChanges();
    flushInitialRequest();
    expect(component).toBeTruthy();
  }));

  it('should load person entity from /assets/data/entities/person.json on init', fakeAsync(() => {
    setupComponent();
    fixture.detectChanges();
    flushInitialRequest();
    expect(component.entityName).toBe('Person');
    expect(component.entityDescription).toBe('Human beings involved with AdventureWorks: employees, customer contacts, and vendor contacts.');
  }));

  it('should populate entityName, entityDescription, and tableData from JSON', fakeAsync(() => {
    setupComponent();
    fixture.detectChanges();
    flushInitialRequest();
    expect(component.entityName).toBe('Person');
    expect(component.entityDescription).toBe('Human beings involved with AdventureWorks: employees, customer contacts, and vendor contacts.');
    expect(component.tableData.length).toBe(4);
    expect(component.tableData[0].name).toBe('BusinessEntityID');
    expect(component.tableData[0].type).toBe('int');
    expect(component.tableData[0].primary).toBeTrue();
  }));

  it('should have all 5 entities available', fakeAsync(() => {
    setupComponent();
    fixture.detectChanges();
    flushInitialRequest();
    expect(component.availableEntities.length).toBe(5);
  }));

  it('should load different entity on selection change', fakeAsync(() => {
    setupComponent();
    fixture.detectChanges();
    flushInitialRequest();

    const mockPhoneNumberType = {
      name: 'PhoneNumberType',
      description: 'Types of telephone numbers.',
      fields: [{name: 'PhoneNumberTypeID', type: 'int', description: 'Primary key.'}]
    };
    component.onEntitySelectionChange('phone_number_type');
    tick();
    const req2 = httpMock.expectOne('/assets/data/entities/phone_number_type.json');
    req2.flush(mockPhoneNumberType);
    tick();

    expect(component.entityName).toBe('PhoneNumberType');
    expect(component.tableData.length).toBe(1);
  }));

  it('should filter entities by search text', fakeAsync(() => {
    setupComponent();
    fixture.detectChanges();
    flushInitialRequest();
    component.searchText = 'Person';
    component.searchEntities();
    expect(component.searchedEntities.length).toBe(2);
  }));

  it('should have correct displayed columns', fakeAsync(() => {
    setupComponent();
    fixture.detectChanges();
    flushInitialRequest();
    expect(component.displayedCols).toEqual(['name', 'type', 'description']);
  }));
});
