import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ViewParamsService } from './view-params.service';
import { AppConfigService } from '../utils/app-config.service';
import { UrlProcessingService } from './url-processing.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ViewParams } from 'src/app/models/admin-pannels/common/view-params';

describe('ViewParamsService', () => {
  let service: ViewParamsService;
  let localStorageService: LocalStorageService;
  let defaultViewParams: ViewParams;

  beforeEach(() => {
    defaultViewParams = new ViewParams(false, false, [10, 25, 50], null, null, null);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ViewParamsService,
        UrlProcessingService,
        LocalStorageService,
        { provide: AppConfigService, useValue: { defaultViewParams } }
      ]
    });
    service = TestBed.inject(ViewParamsService);
    localStorageService = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('defaults', () => {
    it('should return ViewParams from config', () => {
      expect(service.defaults()).toBe(defaultViewParams);
    });
  });

  describe('fromOptParamString', () => {
    it('should return defaults for empty URL string', () => {
      const result = service.fromOptParamString('');
      expect(result.isColumnSetOn).toBe(defaultViewParams.isColumnSetOn);
    });

    it('should parse colSet parameter', () => {
      const result = service.fromOptParamString(';colSet=true');
      expect(result.isColumnSetOn).toBeTrue();
    });

    it('should parse selId parameter', () => {
      const result = service.fromOptParamString(';selId=42');
      expect(result.selectedId).toBe('42');
    });
  });

  describe('allOptParams', () => {
    it('should return all parameters', () => {
      const viewParams = new ViewParams(true, false, [10, 25], '1', '2', '3');
      const result = service.allOptParams(viewParams);
      expect(result['colSet']).toBeTrue();
      expect(result['filSet']).toBeFalse();
      expect(result['selId']).toBe('1');
      expect(result['newId']).toBe('2');
      expect(result['chId']).toBe('3');
    });
  });

  describe('necessaryOptParams', () => {
    it('should return empty for default params', () => {
      const result = service.necessaryOptParams(defaultViewParams);
      expect(Object.keys(result).length).toBe(0);
    });

    it('should include non-default values', () => {
      const params = new ViewParams(!defaultViewParams.isColumnSetOn, defaultViewParams.isFilterSetOn, defaultViewParams.perPageOptions, defaultViewParams.selectedId, defaultViewParams.newId, defaultViewParams.changedId);
      const result = service.necessaryOptParams(params);
      expect(result['colSet']).toBeDefined();
    });
  });

  describe('str2Num', () => {
    it('should convert string to number', () => {
      expect(service.str2Num('42')).toBe(42);
    });

    it('should return -1 for null', () => {
      expect(service.str2Num(null)).toBe(-1);
    });
  });

  describe('num2Str', () => {
    it('should convert number to string', () => {
      expect(service.num2Str(42)).toBe('42');
    });
  });

  describe('str2NSNTuple', () => {
    it('should convert string to tuple', () => {
      const result = service.str2NSNTuple('1/name/2', '/');
      expect(result).toEqual([1, 'name', 2]);
    });

    it('should return default tuple for null', () => {
      const result = service.str2NSNTuple(null, '/');
      expect(result).toEqual([-1, ' ', -1]);
    });
  });

  describe('nsnTuple2Str', () => {
    it('should convert tuple to string', () => {
      expect(service.nsnTuple2Str([1, 'name', 2], '/')).toBe('1/name/2');
    });
  });
});
