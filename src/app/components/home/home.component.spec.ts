import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HomeComponent } from './home.component';
import { AppConfigService } from 'src/app/services/utils/app-config.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const mockAppConfigService = {
    get title() { return 'Test Title'; },
    get shortTitle() { return 'Test'; },
    get emailUrl() { return 'mailto:test@test.com'; }
  };

  let fakeActivatedRoute = {
    snapshot: { data: {}, paramMap: { get: () => null, has: () => false } }
  } as unknown as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HomeComponent],
      providers: [
        {provide: ActivatedRoute, useValue: fakeActivatedRoute},
        {provide: AppConfigService, useValue: mockAppConfigService}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
