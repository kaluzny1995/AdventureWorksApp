import { PersonFilterParams } from './filter-params';

describe('FilterParams', () => {
  it('should create an instance', () => {
    expect(new PersonFilterParams('', '', '')).toBeTruthy();
  });
});
