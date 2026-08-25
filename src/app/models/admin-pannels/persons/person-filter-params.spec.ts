import { PersonFilterParams } from './person-filter-params';

describe('PersonFilterParams', () => {
  it('should create an instance', () => {
    expect(new PersonFilterParams('', '', '')).toBeTruthy();
  });

  it('should have correct properties', () => {
    const params = new PersonFilterParams('GC', 'Doe', 'John');
    expect(params.personType).toBe('GC');
    expect(params.lastNamePhrase).toBe('Doe');
    expect(params.firstNamePhrase).toBe('John');
  });

  describe('fromDict', () => {
    it('should create instance from dict with all keys', () => {
      const result = PersonFilterParams.fromDict({personType: 'GC', lastNamePhrase: 'Doe', firstNamePhrase: 'John'});
      expect(result.personType).toBe('GC');
      expect(result.lastNamePhrase).toBe('Doe');
      expect(result.firstNamePhrase).toBe('John');
    });

    it('should create instance with null values for missing keys', () => {
      const result = PersonFilterParams.fromDict({personType: 'GC'});
      expect(result.personType).toBe('GC');
      expect(result.lastNamePhrase).toBeNull();
      expect(result.firstNamePhrase).toBeNull();
    });

    it('should create instance with null values for null dict', () => {
      const result = PersonFilterParams.fromDict(null);
      expect(result.personType).toBeNull();
      expect(result.lastNamePhrase).toBeNull();
      expect(result.firstNamePhrase).toBeNull();
    });

    it('should create instance with null values for empty dict', () => {
      const result = PersonFilterParams.fromDict({});
      expect(result.personType).toBeNull();
      expect(result.lastNamePhrase).toBeNull();
      expect(result.firstNamePhrase).toBeNull();
    });
  });

  describe('toDict', () => {
    it('should return dict with all values when set', () => {
      const params = new PersonFilterParams('GC', 'Doe', 'John');
      expect(params.toDict()).toEqual({personType: 'GC', lastNamePhrase: 'Doe', firstNamePhrase: 'John'});
    });

    it('should return empty dict when all values are null', () => {
      const params = new PersonFilterParams(null, null, null);
      expect(params.toDict()).toEqual({});
    });

    it('should convert null values to empty strings in dict', () => {
      const params = new PersonFilterParams('GC', null, null);
      expect(params.toDict()).toEqual({personType: 'GC', lastNamePhrase: '', firstNamePhrase: ''});
    });
  });
});
