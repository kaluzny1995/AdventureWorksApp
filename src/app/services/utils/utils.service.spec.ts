import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('dictFromArrays', () => {
    it('should create a dictionary from equal-length arrays', () => {
      const keys = ['a', 'b', 'c'];
      const values = [1, 2, 3];
      expect(service.dictFromArrays(keys, values)).toEqual({a: 1, b: 2, c: 3});
    });

    it('should return empty dictionary for empty arrays', () => {
      expect(service.dictFromArrays([], [])).toEqual({});
    });

    it('should handle single-element arrays', () => {
      expect(service.dictFromArrays(['key'], ['value'])).toEqual({key: 'value'});
    });

    it('should throw EvalError when arrays have different lengths', () => {
      expect(() => service.dictFromArrays(['a', 'b'], [1])).toThrowError(EvalError);
    });

    it('should throw EvalError with descriptive message', () => {
      expect(() => service.dictFromArrays(['a', 'b', 'c'], [1, 2])).toThrowError('Keys and values array length are different: 3!==2');
    });
  });

  describe('prepend', () => {
    it('should prepend item to array', () => {
      expect(service.prepend(1, [2, 3])).toEqual([1, 2, 3]);
    });

    it('should not mutate original array', () => {
      const original = [2, 3];
      service.prepend(1, original);
      expect(original).toEqual([2, 3]);
    });

    it('should prepend to empty array', () => {
      expect(service.prepend(1, [])).toEqual([1]);
    });

    it('should work with string items', () => {
      expect(service.prepend('a', ['b', 'c'])).toEqual(['a', 'b', 'c']);
    });
  });

  describe('getIdFromPKViolationMessage', () => {
    it('should extract first parenthesized value from message', () => {
      const message = 'Key (person_id)=(42) already exists.';
      const result = service.getIdFromPKViolationMessage(message);
      expect(result).toBe('person_id');
    });

    it('should return null when no match found', () => {
      expect(service.getIdFromPKViolationMessage('some random message')).toBeNull();
    });

    it('should extract value from simple message', () => {
      const message = 'duplicate key (42)';
      expect(service.getIdFromPKViolationMessage(message)).toBe('42');
    });
  });

  describe('getIdFromFKViolationString', () => {
    it('should return undefined due to bug (accessing index 2 from regex with 1 capture group)', () => {
      const message = 'Key (person_id)=(42) is not present.';
      expect(service.getIdFromFKViolationString(message)).toBeUndefined();
    });

    it('should return null for non-matching message', () => {
      expect(service.getIdFromFKViolationString('no parens here')).toBeNull();
    });
  });
});
