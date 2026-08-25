import { ColumnSettingsData } from './column-settings-data';

describe('ColumnSettingsData', () => {
  it('should create an instance', () => {
    expect(new ColumnSettingsData('test', [], [], {}, [])).toBeTruthy();
  });
});
