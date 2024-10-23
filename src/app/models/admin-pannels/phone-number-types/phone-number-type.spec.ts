import { PhoneNumberType } from './phone-number-type';

describe('PhoneNumberType', () => {
  it('should create an instance', () => {
    expect(new PhoneNumberType(0, '', new Date())).toBeTruthy();
  });
});
