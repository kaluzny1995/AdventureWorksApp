import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppConfigService } from './services/utils/app-config.service';

describe('AppComponent', () => {
  let httpMock: HttpTestingController;

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

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    const configService = TestBed.inject(AppConfigService);
    (configService as any)._appConfig = { app: { title: 'Test', shortTitle: 'T' }, api: { host: 'localhost', port: 8080 }, defaults: {} };

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const authReq = httpMock.expectOne((request) => request.url.includes('test'));
    authReq.flush({ title: 'UNAUTHENTICATED' });

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have parameters just as in config.json', () => {
    const configService = TestBed.inject(AppConfigService);
    (configService as any)._appConfig = { app: { title: 'AdventureWorks2017 Management App', shortTitle: 'AW2017MA' }, api: { host: 'localhost', port: 8080 }, defaults: {} };

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const authReq = httpMock.expectOne((request) => request.url.includes('test'));
    authReq.flush({ title: 'UNAUTHENTICATED' });

    expect(fixture.componentInstance.title).toEqual('AdventureWorks2017 Management App');
  });
});
