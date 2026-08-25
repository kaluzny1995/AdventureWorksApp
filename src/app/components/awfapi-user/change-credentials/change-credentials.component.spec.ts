import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ChangeCredentialsComponent } from './change-credentials.component';
import { AppConfigService } from 'src/app/services/utils/app-config.service';

describe('ChangeCredentialsComponent', () => {
  let component: ChangeCredentialsComponent;
  let fixture: ComponentFixture<ChangeCredentialsComponent>;

  const mockAppConfigService = {
    get forbiddenUsernames() { return ['admin']; }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, MatSelectModule, MatRadioModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule ],
      declarations: [ ChangeCredentialsComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null, has: () => false } } } },
        { provide: AppConfigService, useValue: mockAppConfigService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
