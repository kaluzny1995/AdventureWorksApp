import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { PersonFormComponent } from './person-form.component';
import { AppConfigService } from 'src/app/services/utils/app-config.service';

describe('PersonFormComponent', () => {
  let component: PersonFormComponent;
  let fixture: ComponentFixture<PersonFormComponent>;

  const mockAppConfigService = {
    get apiUrl() { return 'http://localhost:8080/'; },
    get personDefaults() { return { availableColumns: [], availableColumnNames: [], displayedIndices: [], availableFilters: [], availableFilterNames: [], types: [], nameStyles: [], titles: [], suffixes: [], emailPromotions: [], aciTemplate: '', demoTemplate: '' }; }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, MatDialogModule, MatAutocompleteModule, MatSelectModule, MatRadioModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule, ReactiveFormsModule ],
      declarations: [ PersonFormComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null, has: () => false } }, params: of({}) } },
        { provide: AppConfigService, useValue: mockAppConfigService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
