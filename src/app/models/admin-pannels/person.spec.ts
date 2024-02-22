import { EPersonType } from './e-person-type';
import { Person } from './person';

describe('Person', () => {
  it('should create an instance', () => {
    expect(new Person(0, EPersonType.GC, '0', null, 'Name', null, "LastName", null, 0, null, null, "uuid", new Date())).toBeTruthy();
  });
});
