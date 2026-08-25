import { NameFilterParam } from './name-filter-param';

describe('NameFilterParam', () => {
  it('should create an instance', () => {
    expect(new NameFilterParam(null)).toBeTruthy();
  });

  it('should have correct properties', () => {
    const param = new NameFilterParam('test');
    expect(param.namePhrase).toBe('test');
  });

  describe('fromDict', () => {
    it('should create instance from dict with namePhrase', () => {
      const result = NameFilterParam.fromDict({namePhrase: 'test'});
      expect(result.namePhrase).toBe('test');
    });

    it('should create instance with null namePhrase when dict has no namePhrase', () => {
      const result = NameFilterParam.fromDict({other: 'value'});
      expect(result.namePhrase).toBeNull();
    });

    it('should create instance with null namePhrase for null dict', () => {
      const result = NameFilterParam.fromDict(null);
      expect(result.namePhrase).toBeNull();
    });

    it('should create instance with null namePhrase for empty dict', () => {
      const result = NameFilterParam.fromDict({});
      expect(result.namePhrase).toBeNull();
    });
  });

  describe('toDict', () => {
    it('should return dict with namePhrase when value is set', () => {
      const param = new NameFilterParam('test');
      expect(param.toDict()).toEqual({namePhrase: 'test'});
    });

    it('should return empty dict when namePhrase is null', () => {
      const param = new NameFilterParam(null);
      expect(param.toDict()).toEqual({});
    });

    it('should return empty dict when namePhrase is empty string', () => {
      const param = new NameFilterParam('');
      expect(param.toDict()).toEqual({});
    });
  });
});
