import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getItem', () => {
    it('should return null for non-existing key', () => {
      expect(service.getItem('nonexistent')).toBeNull();
    });

    it('should return value for existing key', () => {
      localStorage.setItem('testkey', 'testvalue');
      expect(service.getItem('testkey')).toBe('testvalue');
    });

    it('should return value with prefix', () => {
      localStorage.setItem('prefix-key', 'value');
      expect(service.getItem('key', 'prefix')).toBe('value');
    });

    it('should return null for non-existing key with prefix', () => {
      expect(service.getItem('nonexistent', 'prefix')).toBeNull();
    });
  });

  describe('setItem', () => {
    it('should set item without prefix', () => {
      service.setItem('key', 'value');
      expect(localStorage.getItem('key')).toBe('value');
    });

    it('should set item with prefix', () => {
      service.setItem('key', 'value', 'prefix');
      expect(localStorage.getItem('prefix-key')).toBe('value');
    });
  });

  describe('removeItem', () => {
    it('should remove item without prefix', () => {
      localStorage.setItem('key', 'value');
      service.removeItem('key');
      expect(localStorage.getItem('key')).toBeNull();
    });

    it('should remove item with prefix', () => {
      localStorage.setItem('prefix-key', 'value');
      service.removeItem('key', 'prefix');
      expect(localStorage.getItem('prefix-key')).toBeNull();
    });
  });

  describe('getAllWithPrefix', () => {
    it('should return empty object when no matching keys', () => {
      expect(service.getAllWithPrefix('prefix')).toEqual({});
    });

    it('should return all entries with matching prefix', () => {
      localStorage.setItem('prefix-a', '1');
      localStorage.setItem('prefix-b', '2');
      localStorage.setItem('other-c', '3');
      const result = service.getAllWithPrefix('prefix');
      expect(result).toEqual({'prefix-a': '1', 'prefix-b': '2'});
    });
  });

  describe('setAllWithPrefix', () => {
    it('should set all entries with prefix', () => {
      service.setAllWithPrefix({a: '1', b: '2'}, 'prefix', false);
      expect(localStorage.getItem('prefix-a')).toBe('1');
      expect(localStorage.getItem('prefix-b')).toBe('2');
    });

    it('should clear existing entries when isCleared is true', () => {
      localStorage.setItem('prefix-old', 'old');
      service.setAllWithPrefix({a: '1'}, 'prefix', true);
      expect(localStorage.getItem('prefix-old')).toBeNull();
      expect(localStorage.getItem('prefix-a')).toBe('1');
    });

    it('should not clear existing entries when isCleared is false', () => {
      localStorage.setItem('prefix-old', 'old');
      service.setAllWithPrefix({a: '1'}, 'prefix', false);
      expect(localStorage.getItem('prefix-old')).toBe('old');
      expect(localStorage.getItem('prefix-a')).toBe('1');
    });
  });

  describe('removeAllWithPrefix', () => {
    it('should remove all entries with matching prefix', () => {
      localStorage.setItem('prefix-a', '1');
      localStorage.setItem('prefix-b', '2');
      localStorage.setItem('other-c', '3');
      service.removeAllWithPrefix('prefix');
      expect(localStorage.getItem('prefix-a')).toBeNull();
      expect(localStorage.getItem('prefix-b')).toBeNull();
      expect(localStorage.getItem('other-c')).toBe('3');
    });
  });
});
