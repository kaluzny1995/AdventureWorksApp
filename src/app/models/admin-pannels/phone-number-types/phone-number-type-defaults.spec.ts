import { PhoneNumberTypeDefaults } from './phone-number-type-defaults';

describe('PhoneNumberTypeDefaults', () => {
  it('should create with all properties', () => {
    const defaults = new PhoneNumberTypeDefaults(['f1'], ['F1'], 1, 10);
    expect(defaults).toBeTruthy();
  });

  it('should store all properties', () => {
    const defaults = new PhoneNumberTypeDefaults(['f1', 'f2'], ['F1', 'F2'], 5, 20);
    expect(defaults.availableFilters).toEqual(['f1', 'f2']);
    expect(defaults.availableFilterNames).toEqual(['F1', 'F2']);
    expect(defaults.newId).toBe(5);
    expect(defaults.perPage).toBe(20);
  });

  describe('newIdString getter', () => {
    it('should return newId as string', () => {
      const defaults = new PhoneNumberTypeDefaults([], [], 42, 10);
      expect(defaults.newIdString).toBe('42');
    });

    it('should return "0" for newId of 0', () => {
      const defaults = new PhoneNumberTypeDefaults([], [], 0, 10);
      expect(defaults.newIdString).toBe('0');
    });
  });
});
