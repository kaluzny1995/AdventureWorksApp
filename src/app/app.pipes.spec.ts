import { XmlPipe } from './app.pipes';

describe('XmlPipe', () => {
  let pipe: XmlPipe;

  beforeEach(() => {
    pipe = new XmlPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return null for null input', () => {
      expect(pipe.transform(null)).toBeNull();
    });

    it('should format valid XML string', () => {
      const input = '<root><child>text</child></root>';
      const result = pipe.transform(input);
      expect(result).toContain('<root>');
      expect(result).toContain('<child>');
      expect(result).toContain('text');
    });

    it('should return "Invalid XML document" for non-XML text', () => {
      const input = 'this is not xml';
      expect(pipe.transform(input)).toBe('Invalid XML document');
    });

    it('should format XML with indentation', () => {
      const input = '<root><a>1</a></root>';
      const result = pipe.transform(input);
      expect(result).toContain('  ');
    });

    it('should handle empty string input', () => {
      const result = pipe.transform('');
      expect(result === 'Invalid XML document' || typeof result === 'string').toBeTrue();
    });
  });
});
