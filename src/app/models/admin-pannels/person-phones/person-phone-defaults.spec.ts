import { PersonPhoneDefaults } from './person-phone-defaults';

describe('PersonPhoneDefaults', () => {
  it('should create with all properties', () => {
    const defaults = new PersonPhoneDefaults(
      ':', ['col1'], ['Col 1'], [0], ['filter1'], ['Filter 1']
    );
    expect(defaults).toBeTruthy();
  });

  it('should store all properties', () => {
    const defaults = new PersonPhoneDefaults(
      '|', ['col1', 'col2'], ['Col 1', 'Col 2'], [0, 1], ['f1', 'f2'], ['F1', 'F2']
    );
    expect(defaults.idSeparator).toBe('|');
    expect(defaults.availableColumns).toEqual(['col1', 'col2']);
    expect(defaults.availableColumnNames).toEqual(['Col 1', 'Col 2']);
    expect(defaults.displayedIndices).toEqual([0, 1]);
    expect(defaults.availableFilters).toEqual(['f1', 'f2']);
    expect(defaults.availableFilterNames).toEqual(['F1', 'F2']);
  });
});
