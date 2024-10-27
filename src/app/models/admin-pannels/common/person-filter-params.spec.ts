import { PersonFilterParams } from './person-filter-params';

describe('PersonFilterParams', () => {
  it('should create an instance', () => {
    expect(new PersonFilterParams('', '', '')).toBeTruthy();
  });
});
