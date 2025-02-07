import { PersonPhone } from './person-phone';

describe('PersonPhone', () => {
  it('should create an instance', () => {
    expect(new PersonPhone(0, '', 0, new Date())).toBeTruthy();
  });
});
