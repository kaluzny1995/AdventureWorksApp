import { TestBed } from '@angular/core/testing';

import { ColumnDisplayingService } from './column-displaying.service';
import { UrlProcessingService } from './url-processing.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ColumnNotFoundError } from 'src/app/app.errors';

describe('ColumnDisplayingService', () => {
  let service: ColumnDisplayingService;
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColumnDisplayingService, UrlProcessingService, LocalStorageService]
    });
    service = TestBed.inject(ColumnDisplayingService);
    localStorageService = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fromOptParamString', () => {
    it('should return default indices when no displayedCols param', () => {
      const defaults = [0, 1, 2];
      const result = service.fromOptParamString('', defaults);
      expect(result).toEqual(defaults);
    });

    it('should parse displayedCols from URL', () => {
      const result = service.fromOptParamString(';displayedCols=0,2', [0, 1, 2]);
      expect(result).toEqual([0, 2]);
    });
  });

  describe('displayedColumns', () => {
    it('should map indices to column names', () => {
      const columns = ['Name', 'Email', 'Phone'];
      expect(service.displayedColumns([0, 2], columns)).toEqual(['Name', 'Phone']);
    });

    it('should throw ColumnNotFoundError for invalid index', () => {
      expect(() => service.displayedColumns([5], ['Name'])).toThrowError(ColumnNotFoundError);
    });
  });

  describe('optParam', () => {
    it('should return displayedCols dictionary', () => {
      const columns = ['Name', 'Email', 'Phone'];
      const result = service.optParam(['Name', 'Phone'], columns);
      expect(result).toEqual({displayedCols: '0,2'});
    });
  });

  describe('necessaryOptParam', () => {
    it('should return empty when same as defaults', () => {
      const columns = ['Name', 'Email', 'Phone'];
      const result = service.necessaryOptParam(['Name', 'Email'], columns, [0, 1]);
      expect(result).toEqual({});
    });

    it('should return displayedCols when different from defaults', () => {
      const columns = ['Name', 'Email', 'Phone'];
      const result = service.necessaryOptParam(['Name', 'Phone'], columns, [0, 1]);
      expect(result).toEqual({displayedCols: '0,2'});
    });
  });
});
