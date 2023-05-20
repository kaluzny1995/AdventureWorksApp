import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppConfigService } from './services/app-config.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        AppConfigService
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have parameters just as in config.json', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    const configService = TestBed.inject(AppConfigService);

    expect(app.title).toEqual(configService.title);
  });
});
