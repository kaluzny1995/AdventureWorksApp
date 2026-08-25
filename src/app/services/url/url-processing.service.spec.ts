import { TestBed } from '@angular/core/testing';

import { UrlProcessingService } from './url-processing.service';

describe('UrlProcessingService', () => {
  let service: UrlProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('decode', () => {
    it('should decode URL encoded string', () => {
      expect(service.decode('%2Fsome%2Fthing')).toBe('/some/thing');
    });

    it('should decode string with semicolons', () => {
      expect(service.decode('status%3Dsigned_in')).toBe('status=signed_in');
    });
  });

  describe('encode', () => {
    it('should encode string for URL', () => {
      expect(service.encode('/some/thing')).toBe('%2Fsome%2Fthing');
    });

    it('should encode semicolons', () => {
      expect(service.encode('status=signed_in')).toBe('status%3Dsigned_in');
    });
  });

  describe('encodePart', () => {
    it('should encode content between square brackets', () => {
      const input = '/some/thing;returnUrl=[/other/path]';
      const result = service.encodePart(input);
      expect(result).toContain('%5B');
      expect(result).toContain('%5D');
    });

    it('should return original string when no brackets present', () => {
      const input = '/some/thing;status=signed_in';
      expect(service.encodePart(input)).toBe(input);
    });
  });

  describe('bracket', () => {
    it('should wrap string in square brackets', () => {
      expect(service.bracket('something')).toBe('[something]');
    });
  });

  describe('unbracket', () => {
    it('should remove surrounding square brackets', () => {
      expect(service.unbracket('[something]')).toBe('something');
    });
  });

  describe('base', () => {
    it('should return path before semicolon', () => {
      expect(service.base('some/thing/1;status=signed_in')).toBe('some/thing/1');
    });

    it('should return full URL when no semicolon', () => {
      expect(service.base('some/thing/1')).toBe('some/thing/1');
    });
  });

  describe('optParamString', () => {
    it('should return params after semicolon', () => {
      expect(service.optParamString('some/thing/1;status=signed_in')).toBe('status=signed_in');
    });

    it('should return empty string when no semicolon', () => {
      expect(service.optParamString('some/thing/1')).toBe('');
    });

    it('should handle multiple params', () => {
      expect(service.optParamString('base;a=1;b=2')).toBe('a=1;b=2');
    });
  });

  describe('optParams', () => {
    it('should parse URL params to dictionary', () => {
      expect(service.optParams('some/thing/1;status=signed_in')).toEqual({status: 'signed_in'});
    });

    it('should return empty dict when no params', () => {
      expect(service.optParams('some/thing/1')).toEqual({});
    });

    it('should handle multiple params', () => {
      expect(service.optParams('base;a=1;b=hello%20world')).toEqual({a: '1', b: 'hello world'});
    });
  });
});
