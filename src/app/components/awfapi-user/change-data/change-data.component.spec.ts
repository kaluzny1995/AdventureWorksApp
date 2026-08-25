import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ChangeDataComponent } from './change-data.component';
import { AppConfigService } from 'src/app/services/utils/app-config.service';

describe('ChangeDataComponent', () => {
  let component: ChangeDataComponent;
  let fixture: ComponentFixture<ChangeDataComponent>;

  const mockAppConfigService = {
    get apiUrl() { return 'http://localhost:8080/'; },
    get forbiddenUsernames() { return []; }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, MatCheckboxModule ],
      declarations: [ ChangeDataComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null, has: () => false } } } },
        { provide: AppConfigService, useValue: mockAppConfigService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
