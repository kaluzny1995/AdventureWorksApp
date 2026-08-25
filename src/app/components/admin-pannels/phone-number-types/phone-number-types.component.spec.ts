import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PhoneNumberTypesComponent } from './phone-number-types.component';
import { AppConfigService } from 'src/app/services/utils/app-config.service';

describe('PhoneNumberTypesComponent', () => {
  let component: PhoneNumberTypesComponent;
  let fixture: ComponentFixture<PhoneNumberTypesComponent>;

  const mockAppConfigService = {
    get apiUrl() { return 'http://localhost:8080/'; },
    get phoneNumberTypeDefaults() { return { availableFilters: [], availableFilterNames: [], newId: -1, perPage: 10 }; },
    get defaultQueryParams() { return { page: 1, perPage: 10, filters: null, orderBy: null, type: 'ASC' }; },
    get defaultViewParams() { return { isColumnSetOn: false, isFilterSetOn: false, perPageOptions: [10], selectedId: null, newId: null, changedId: null }; }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, MatDialogModule, ReactiveFormsModule ],
      declarations: [ PhoneNumberTypesComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null, has: () => false } } } },
        { provide: AppConfigService, useValue: mockAppConfigService }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneNumberTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
