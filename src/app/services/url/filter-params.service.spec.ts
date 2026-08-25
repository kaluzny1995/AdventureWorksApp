import { TestBed } from '@angular/core/testing';

import { FilterParamsService } from './filter-params.service';

describe('FilterParamsService', () => {
  let service: FilterParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('filterString', () => {
    it('should convert filter params dict to filter string', () => {
      const params = {person_type: 'GC', first_name_phrase: 'jak'};
      expect(service.filterString(params)).toBe('person_type:GC,first_name_phrase:jak');
    });

    it('should return empty string for null input', () => {
      expect(service.filterString(null)).toBe('');
    });

    it('should handle single filter', () => {
      expect(service.filterString({name: 'value'})).toBe('name:value');
    });
  });

  describe('fromFilterString', () => {
    it('should convert filter string to dict', () => {
      expect(service.fromFilterString('person_type:GC,first_name_phrase:jak')).toEqual({person_type: 'GC', first_name_phrase: 'jak'});
    });

    it('should return null for empty string', () => {
      expect(service.fromFilterString('')).toBeNull();
    });

    it('should handle single filter', () => {
      expect(service.fromFilterString('name:value')).toEqual({name: 'value'});
    });
  });

  describe('camelCase', () => {
    it('should convert snake_case keys to camelCase', () => {
      expect(service.camelCase({person_type: 'GC', last_name_phrase: 'aw'})).toEqual({personType: 'GC', lastNamePhrase: 'aw'});
    });

    it('should return null for null input', () => {
      expect(service.camelCase(null)).toBeNull();
    });

    it('should handle already camelCase keys', () => {
      expect(service.camelCase({alreadyCamel: 'val'})).toEqual({alreadyCamel: 'val'});
    });
  });

  describe('snakeCase', () => {
    it('should convert camelCase keys to snake_case', () => {
      expect(service.snakeCase({personType: 'GC', lastNamePhrase: 'aw'})).toEqual({person_type: 'GC', last_name_phrase: 'aw'});
    });

    it('should return null for null input', () => {
      expect(service.snakeCase(null)).toBeNull();
    });

    it('should handle already snake_case keys', () => {
      expect(service.snakeCase({already_snake: 'val'})).toEqual({already_snake: 'val'});
    });
  });

  describe('names', () => {
    it('should extract filter names from filter string', () => {
      expect(service.names('person_type:GC,first_name_phrase:jak')).toEqual(['person_type', 'first_name_phrase']);
    });

    it('should return empty array for empty string', () => {
      expect(service.names('')).toEqual([]);
    });

    it('should handle single filter', () => {
      expect(service.names('name:value')).toEqual(['name']);
    });
  });

  describe('minimized', () => {
    it('should remove null, empty, undefined and [] values', () => {
      const params: {[key: string]: string | null | undefined} = {a: 'val', b: null, c: '', d: undefined, e: '[]'};
      expect(service.minimized(params as any)).toEqual({a: 'val'});
    });

    it('should return null for null input', () => {
      expect(service.minimized(null)).toBeNull();
    });

    it('should return null when all values are empty/null/undefined/[]', () => {
      expect(service.minimized({a: null as any, b: '', c: '[]'})).toBeNull();
    });

    it('should keep valid values', () => {
      expect(service.minimized({a: 'valid', b: 'also_valid'})).toEqual({a: 'valid', b: 'also_valid'});
    });
  });
});
