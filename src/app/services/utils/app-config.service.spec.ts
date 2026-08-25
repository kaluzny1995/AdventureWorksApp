import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let httpMock: HttpTestingController;

  const mockConfig = {
    app: {
      title: 'AdventureWorks2017 Management App',
      shortTitle: 'AW2017MA',
      description: 'An application for AdventureWork2017 data warehouse management.',
      author: {
        name: 'Dzhejkob Awaria',
        position: 'Python Developer & Data Engineer',
        urls: {
          github: 'https://github.com/kaluzny1995',
          linkedin: 'https://www.linkedin.com/in/test/',
          facebook: 'https://www.facebook.com/test',
          projects: { MFD: 'https://github.com/test/MFD', HSD: 'https://github.com/test/HSD' }
        },
        email: {
          address: 'dzh.awaria@gmail.com',
          to: { subject: 'Hello', body: 'Message for you...' }
        }
      }
    },
    api: {
      host: 'localhost',
      port: 8080,
      authRequiredEndpoints: ['test', 'verify', 'get_persons'],
      forbiddenUsernames: ['admin', 'user', 'username']
    },
    defaults: {
      countdownTimer: {
        timeMins: 30, notifyGreenAt: 0.8, notifyYellowAt: 0.4, notifyRedAt: 0.2,
        timeFormat: 'mm:ss', tooltipText: 'Time left', tooltipFinishText: 'Expiring',
        spinnerDiameter: 300, spinnerStrokeWidth: 20, titleText: 'Time left', titleTextFinish: 'Expiring soon'
      },
      queryParams: { page: 1, perPage: 10, filters: null, orderBy: null, type: 'asc' },
      view: { isColumnSetOn: false, isFilterSetOn: false, perPageOptions: [10, 20, 50], selectedId: null, newId: null, changedId: null },
      person: {
        availableColumns: ['personId', 'fullName'],
        availableColumnNames: ['ID', 'Full name'],
        displayedIndices: [0, 1],
        availableFilters: ['personType'],
        availableFilterNames: ['Person type'],
        types: { IN: 'Individual' },
        nameStyles: { '0': 'western' },
        titles: ['Mr.', 'Ms.'],
        suffixes: ['Jr.'],
        emailPromotions: { '0': 'No promotions' },
        aciTemplate: '<address/>',
        demoTemplate: '<demographics/>'
      },
      phoneNumberType: {
        availableFilters: ['namePhrase'],
        availableFilterNames: ['Name phrase'],
        newId: -1,
        perPage: 100
      },
      personPhone: {
        idSeparator: '|',
        availableColumns: ['personFullName'],
        availableColumnNames: ['Person'],
        displayedIndices: [0],
        availableFilters: ['personIds'],
        availableFilterNames: ['Persons']
      },
      prefixes: ['person', 'phone-number-type', 'person-phone']
    }
  };

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppConfigService]
    });
    service = TestBed.inject(AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);

    service.loadAppConfig().then(() => {});
    tick();
    const req = httpMock.expectOne('/assets/config.json');
    req.flush(mockConfig);
    tick();
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load config from /assets/config.json via GET', () => {
    expect(service.title).toBe('AdventureWorks2017 Management App');
  });

  describe('app config getters', () => {
    it('should return title', () => {
      expect(service.title).toBe('AdventureWorks2017 Management App');
    });

    it('should return shortTitle', () => {
      expect(service.shortTitle).toBe('AW2017MA');
    });

    it('should return description', () => {
      expect(service.description).toBe('An application for AdventureWork2017 data warehouse management.');
    });

    it('should return author object', () => {
      expect(service.author.name).toBe('Dzhejkob Awaria');
      expect(service.author.position).toBe('Python Developer & Data Engineer');
    });

    it('should return email address', () => {
      expect(service.email).toBe('dzh.awaria@gmail.com');
    });

    it('should return formatted emailUrl with mailto link', () => {
      expect(service.emailUrl).toBe('mailto:dzh.awaria@gmail.com?subject=Hello&body=Message for you...');
    });
  });

  describe('api config getters', () => {
    it('should return formatted apiUrl', () => {
      expect(service.apiUrl).toBe('http://localhost:8080/');
    });

    it('should return authRequiredEndpoints', () => {
      expect(service.authRequiredEndpoints).toEqual(['test', 'verify', 'get_persons']);
    });

    it('should return forbiddenUsernames', () => {
      expect(service.forbiddenUsernames).toEqual(['admin', 'user', 'username']);
    });
  });

  describe('countdownTimerSettings', () => {
    it('should return CountdownTimerSettings with all properties', () => {
      const settings = service.countdownTimerSettings;
      expect(settings).toBeDefined();
      expect(settings.timeMins).toBe(30);
      expect(settings.timeFormat).toBe('mm:ss');
      expect(settings.spinnerDiameter).toBe(300);
    });
  });

  describe('defaultQueryParams', () => {
    it('should return QueryParams with all properties', () => {
      const params = service.defaultQueryParams;
      expect(params).toBeDefined();
      expect(params.page).toBe(1);
      expect(params.perPage).toBe(10);
      expect(params.type).toBe('asc');
    });
  });

  describe('defaultViewParams', () => {
    it('should return ViewParams with all properties', () => {
      const params = service.defaultViewParams;
      expect(params).toBeDefined();
      expect(params.isColumnSetOn).toBeFalse();
      expect(params.isFilterSetOn).toBeFalse();
      expect(params.perPageOptions).toEqual([10, 20, 50]);
    });
  });

  describe('personDefaults', () => {
    it('should return PersonDefaults with all properties from config', () => {
      const defaults = service.personDefaults;
      expect(defaults).toBeDefined();
      expect(defaults.availableColumns).toEqual(['personId', 'fullName']);
      expect(defaults.availableColumnNames).toEqual(['ID', 'Full name']);
      expect(defaults.displayedIndices).toEqual([0, 1]);
      expect(defaults.types).toEqual({ IN: 'Individual' });
      expect(defaults.aciTemplate).toBe('<address/>');
      expect(defaults.demoTemplate).toBe('<demographics/>');
    });
  });

  describe('phoneNumberTypeDefaults', () => {
    it('should return PhoneNumberTypeDefaults with all properties', () => {
      const defaults = service.phoneNumberTypeDefaults;
      expect(defaults).toBeDefined();
      expect(defaults.availableFilters).toEqual(['namePhrase']);
      expect(defaults.newId).toBe(-1);
      expect(defaults.perPage).toBe(100);
    });
  });

  describe('personPhoneDefaults', () => {
    it('should return PersonPhoneDefaults with all properties', () => {
      const defaults = service.personPhoneDefaults;
      expect(defaults).toBeDefined();
      expect(defaults.idSeparator).toBe('|');
      expect(defaults.availableColumns).toEqual(['personFullName']);
      expect(defaults.displayedIndices).toEqual([0]);
    });
  });

  describe('prefixes', () => {
    it('should return prefixes array', () => {
      expect(service.prefixes).toEqual(['person', 'phone-number-type', 'person-phone']);
    });
  });
});
