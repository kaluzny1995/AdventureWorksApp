import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PersonsComponent } from './persons.component';
import { AppConfigService } from 'src/app/services/utils/app-config.service';

describe('PersonsComponent', () => {
  let component: PersonsComponent;
  let fixture: ComponentFixture<PersonsComponent>;

  const mockAppConfigService = {
    get apiUrl() { return 'http://localhost:8080/'; },
    get personDefaults() { return { availableColumns: [], availableColumnNames: [], displayedIndices: [], availableFilters: [], availableFilterNames: [], types: [], nameStyles: [], titles: [], suffixes: [], emailPromotions: [], aciTemplate: '', demoTemplate: '' }; },
    get defaultQueryParams() { return { page: 1, perPage: 10, filters: null, orderBy: null, type: 'ASC' }; },
    get defaultViewParams() { return { isColumnSetOn: false, isFilterSetOn: false, perPageOptions: [10], selectedId: null, newId: null, changedId: null }; }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, MatDialogModule ],
      declarations: [ PersonsComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null, has: () => false } } } },
        { provide: AppConfigService, useValue: mockAppConfigService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
