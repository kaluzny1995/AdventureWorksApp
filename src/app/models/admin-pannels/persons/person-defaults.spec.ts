import { PersonDefaults } from './person-defaults';

describe('PersonDefaults', () => {
  const defaultArgs = {
    availableColumns: ['col1', 'col2'],
    availableColumnNames: ['Col 1', 'Col 2'],
    displayedIndices: [0, 1],
    availableFilters: ['filter1'],
    availableFilterNames: ['Filter 1'],
    types: {individual: 'Individual', store: 'Store'},
    nameStyles: {style1: 'Style 1'},
    titles: ['Mr.', 'Ms.'],
    suffixes: ['Jr.', 'Sr.'],
    emailPromotions: {none: 'None', yes: 'Yes'},
    aciTemplate: '<root/>',
    demoTemplate: '<data/>'
  };

  it('should create with all properties', () => {
    const defaults = new PersonDefaults(
      defaultArgs.availableColumns, defaultArgs.availableColumnNames,
      defaultArgs.displayedIndices, defaultArgs.availableFilters,
      defaultArgs.availableFilterNames, defaultArgs.types,
      defaultArgs.nameStyles, defaultArgs.titles,
      defaultArgs.suffixes, defaultArgs.emailPromotions,
      defaultArgs.aciTemplate, defaultArgs.demoTemplate
    );
    expect(defaults).toBeTruthy();
  });

  it('should store all properties as readonly', () => {
    const defaults = new PersonDefaults(
      defaultArgs.availableColumns, defaultArgs.availableColumnNames,
      defaultArgs.displayedIndices, defaultArgs.availableFilters,
      defaultArgs.availableFilterNames, defaultArgs.types,
      defaultArgs.nameStyles, defaultArgs.titles,
      defaultArgs.suffixes, defaultArgs.emailPromotions,
      defaultArgs.aciTemplate, defaultArgs.demoTemplate
    );
    expect(defaults.availableColumns).toEqual(['col1', 'col2']);
    expect(defaults.availableColumnNames).toEqual(['Col 1', 'Col 2']);
    expect(defaults.displayedIndices).toEqual([0, 1]);
    expect(defaults.availableFilters).toEqual(['filter1']);
    expect(defaults.availableFilterNames).toEqual(['Filter 1']);
    expect(defaults.types).toEqual({individual: 'Individual', store: 'Store'});
    expect(defaults.nameStyles).toEqual({style1: 'Style 1'});
    expect(defaults.titles).toEqual(['Mr.', 'Ms.']);
    expect(defaults.suffixes).toEqual(['Jr.', 'Sr.']);
    expect(defaults.emailPromotions).toEqual({none: 'None', yes: 'Yes'});
    expect(defaults.aciTemplate).toBe('<root/>');
    expect(defaults.demoTemplate).toBe('<data/>');
  });
});
