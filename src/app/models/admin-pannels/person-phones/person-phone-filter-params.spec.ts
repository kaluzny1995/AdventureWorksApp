import { PersonPhoneFilterParams } from './person-phone-filter-params';

describe('PersonPhoneFilterParams', () => {
  it('should create an instance', () => {
    expect(new PersonPhoneFilterParams([], [])).toBeTruthy();
  });

  it('should have correct properties', () => {
    const params = new PersonPhoneFilterParams([1, 2], [3, 4]);
    expect(params.personIds).toEqual([1, 2]);
    expect(params.phoneNumberTypeIds).toEqual([3, 4]);
  });

  describe('fromDict', () => {
    it('should create instance from dict with all keys', () => {
      const result = PersonPhoneFilterParams.fromDict({personIds: '[1,2]', phoneNumberTypeIds: '[3,4]'}, ',');
      expect(result.personIds).toEqual([1, 2]);
      expect(result.phoneNumberTypeIds).toEqual([3, 4]);
    });

    it('should create instance with null for missing keys', () => {
      const result = PersonPhoneFilterParams.fromDict({personIds: '[1,2]'}, ',');
      expect(result.personIds).toEqual([1, 2]);
      expect(result.phoneNumberTypeIds).toBeNull();
    });

    it('should create instance with null values for null dict', () => {
      const result = PersonPhoneFilterParams.fromDict(null, ',');
      expect(result.personIds).toBeNull();
      expect(result.phoneNumberTypeIds).toBeNull();
    });
  });

  describe('toDict', () => {
    it('should return dict with bracket string values', () => {
      const params = new PersonPhoneFilterParams([1, 2], [3, 4]);
      expect(params.toDict(',')).toEqual({personIds: '[1,2]', phoneNumberTypeIds: '[3,4]'});
    });

    it('should return empty dict when all values are null', () => {
      const params = new PersonPhoneFilterParams(null, null);
      expect(params.toDict(',')).toEqual({});
    });

    it('should convert null to empty string', () => {
      const params = new PersonPhoneFilterParams([1], null);
      expect(params.toDict(',')).toEqual({personIds: '[1]', phoneNumberTypeIds: ''});
    });

    it('should handle different separators', () => {
      const params = new PersonPhoneFilterParams([1, 2], [3, 4]);
      expect(params.toDict('|')).toEqual({personIds: '[1|2]', phoneNumberTypeIds: '[3|4]'});
    });
  });
});
