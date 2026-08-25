import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { PersonPhoneFormComponent } from './person-phone-form.component';
import { AppConfigService } from 'src/app/services/utils/app-config.service';

describe('PersonPhoneFormComponent', () => {
  let component: PersonPhoneFormComponent;
  let fixture: ComponentFixture<PersonPhoneFormComponent>;

  const mockAppConfigService = {
    get apiUrl() { return 'http://localhost:8080/'; },
    get personPhoneDefaults() { return { idSeparator: '|', availableColumns: [], availableColumnNames: [], displayedIndices: [], availableFilters: [], availableFilterNames: [] }; }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, MatSelectModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, NgxMatSelectSearchModule, NoopAnimationsModule ],
      declarations: [ PersonPhoneFormComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null, has: () => false } }, params: of({}) } },
        { provide: AppConfigService, useValue: mockAppConfigService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonPhoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
