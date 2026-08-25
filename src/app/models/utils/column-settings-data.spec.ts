import { ColumnSettingsData } from './column-settings-data';

describe('ColumnSettingsData', () => {
  it('should create an instance', () => {
    expect(new ColumnSettingsData('entity', [], [], {}, [])).toBeTruthy();
  });

  it('should have correct properties', () => {
    const cols = ['Name', 'Email'];
    const mapping = {0: 'Name', 1: 'Email'};
    const data = new ColumnSettingsData('person', cols, ['n', 'e'], mapping, [0, 1]);
    expect(data.entityName).toBe('person');
    expect(data.selectedNames).toEqual(cols);
    expect(data.availableColumns).toEqual(['n', 'e']);
    expect(data.columnNameMapping).toEqual(mapping);
    expect(data.defaultIndices).toEqual([0, 1]);
  });
});
