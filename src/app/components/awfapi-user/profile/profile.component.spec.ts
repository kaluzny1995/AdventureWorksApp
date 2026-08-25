import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ProfileComponent } from './profile.component';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';
import { AppConfigService } from 'src/app/services/utils/app-config.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const mockAuthService = {
    getUsernameFromToken() { return 'testuser'; },
    testAuthentication() { return { subscribe: () => {} }; },
    getCurrentUser() { return { subscribe: () => {} }; },
    removeToken() {},
    setToken() {},
    getExpirationDateFromToken() { return new Date(); }
  };

  const mockAppConfigService = {
    get apiUrl() { return 'http://localhost:8080/'; }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule],
      declarations: [ProfileComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null, has: () => false } } } },
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: AppConfigService, useValue: mockAppConfigService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
