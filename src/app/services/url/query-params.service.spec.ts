import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { QueryParamsService } from './query-params.service';
import { AppConfigService } from '../utils/app-config.service';
import { UrlProcessingService } from './url-processing.service';
import { FilterParamsService } from './filter-params.service';
import { QueryParams } from 'src/app/models/admin-pannels/common/query-params';
import { EOrderType } from 'src/app/models/admin-pannels/common/e-order-type';
import { FilterNameError, FilterValueError, OptionalParamError } from 'src/app/app.errors';

describe('QueryParamsService', () => {
  let service: QueryParamsService;
  let defaultQueryParams: QueryParams;

  beforeEach(() => {
    defaultQueryParams = new QueryParams(1, 10, null, null, EOrderType.ASC);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        QueryParamsService,
        UrlProcessingService,
        FilterParamsService,
        { provide: AppConfigService, useValue: { defaultQueryParams } }
      ]
    });
    service = TestBed.inject(QueryParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('defaults', () => {
    it('should return QueryParams from config', () => {
      expect(service.defaults()).toBe(defaultQueryParams);
    });
  });

  describe('camelCase', () => {
    it('should convert snake_case to camelCase', () => {
      expect(service.camelCase('first_name_phrase')).toBe('firstNamePhrase');
    });

    it('should return null for null input', () => {
      expect(service.camelCase(null)).toBeNull();
    });
  });

  describe('snakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(service.snakeCase('firstNamePhrase')).toBe('first_name_phrase');
    });

    it('should return null for null input', () => {
      expect(service.snakeCase(null)).toBeNull();
    });
  });

  describe('fromOptParamString', () => {
    it('should return defaults for empty URL string', () => {
      const result = service.fromOptParamString('');
      expect(result.page).toBe(defaultQueryParams.page);
      expect(result.perPage).toBe(defaultQueryParams.perPage);
    });

    it('should parse page parameter', () => {
      const result = service.fromOptParamString(';page=5');
      expect(result.page).toBe(5);
    });

    it('should parse perPage parameter', () => {
      const result = service.fromOptParamString(';perPage=25');
      expect(result.perPage).toBe(25);
    });

    it('should parse orderBy parameter', () => {
      const result = service.fromOptParamString(';orderBy=firstName');
      expect(result.orderBy).toBe('firstName');
    });

    it('should parse type parameter', () => {
      const result = service.fromOptParamString(';type=asc');
      expect(result.type).toBe(EOrderType.ASC);
    });

    it('should throw OptionalParamError for unknown parameter', () => {
      expect(() => service.fromOptParamString(';unknownParam=value')).toThrowError(OptionalParamError);
    });

    it('should throw FilterValueError for unknown order type', () => {
      expect(() => service.fromOptParamString(';type=invalid')).toThrowError(FilterValueError);
    });

    it('should throw FilterNameError for unknown filter name', () => {
      expect(() => service.fromOptParamString(';filters=unknownFilter:value', ['knownFilter'])).toThrowError(FilterNameError);
    });

    it('should accept valid filter name', () => {
      const result = service.fromOptParamString(';filters=knownFilter:value', ['knownFilter']);
      expect(result.filters).toEqual({knownFilter: 'value'});
    });
  });

  describe('necessaryOptParams', () => {
    it('should return empty for default params', () => {
      const result = service.necessaryOptParams(defaultQueryParams);
      expect(Object.keys(result).length).toBe(0);
    });

    it('should include non-default values', () => {
      const params = new QueryParams(defaultQueryParams.page + 1, defaultQueryParams.perPage, defaultQueryParams.filters, defaultQueryParams.orderBy, defaultQueryParams.type);
      const result = service.necessaryOptParams(params);
      expect(result['page']).toBeDefined();
    });
  });

  describe('apiOptParamString', () => {
    it('should return empty string for default params', () => {
      expect(service.apiOptParamString(defaultQueryParams)).toBe('');
    });

    it('should include non-default values in query string', () => {
      const params = new QueryParams(defaultQueryParams.page + 1, defaultQueryParams.perPage, defaultQueryParams.filters, defaultQueryParams.orderBy, defaultQueryParams.type);
      const result = service.apiOptParamString(params);
      expect(result).toContain('offset=');
    });
  });

  describe('apiOptFilterParam', () => {
    it('should return empty string for null filters', () => {
      expect(service.apiOptFilterParam(null)).toBe('');
    });

    it('should include filters in query string', () => {
      const result = service.apiOptFilterParam({personType: 'GC'});
      expect(result).toContain('filters=');
    });
  });
});
