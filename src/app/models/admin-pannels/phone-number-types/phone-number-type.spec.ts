import { PhoneNumberType, PhoneNumberTypeInput } from './phone-number-type';

describe('PhoneNumberType', () => {
  it('should create an instance', () => {
    expect(new PhoneNumberType(1, 'Home', new Date())).toBeTruthy();
  });

  it('should have correct properties', () => {
    const date = new Date('2024-01-01');
    const type = new PhoneNumberType(1, 'Home', date);
    expect(type.phoneNumberTypeId).toBe(1);
    expect(type.name).toBe('Home');
    expect(type.modifiedDate).toBe(date);
  });

  describe('phoneNumberTypeIdString', () => {
    it('should return string representation of id', () => {
      const type = new PhoneNumberType(42, 'Work', new Date());
      expect(type.phoneNumberTypeIdString).toBe('42');
    });
  });

  describe('fromAPIStructure', () => {
    it('should create instance from API data', () => {
      const data = {
        phone_number_type_id: 1,
        name: 'Home',
        modified_date: '2024-01-01T00:00:00'
      };
      const type = PhoneNumberType.fromAPIStructure(data);
      expect(type.phoneNumberTypeId).toBe(1);
      expect(type.name).toBe('Home');
      expect(type.modifiedDate).toEqual(new Date('2024-01-01T00:00:00'));
    });
  });

  describe('toMSListItem', () => {
    it('should convert to MSListItem format', () => {
      const type = new PhoneNumberType(1, 'Home', new Date());
      expect(type.toMSListItem()).toEqual({id: 1, itemName: 'Home'});
    });
  });

  describe('toFormStructure', () => {
    it('should convert to form structure', () => {
      const type = new PhoneNumberType(1, 'Home', new Date());
      expect(type.toFormStructure()).toEqual({name: 'Home'});
    });
  });
});

describe('PhoneNumberTypeInput', () => {
  it('should create an instance', () => {
    expect(new PhoneNumberTypeInput('Home')).toBeTruthy();
  });

  it('should have correct properties', () => {
    const input = new PhoneNumberTypeInput('Work');
    expect(input.name).toBe('Work');
  });

  describe('fromFormStructure', () => {
    it('should create instance from form data', () => {
      const data = {name: 'Home'};
      const input = PhoneNumberTypeInput.fromFormStructure(data);
      expect(input.name).toBe('Home');
    });
  });

  describe('toAPIStructure', () => {
    it('should convert to API format', () => {
      const input = new PhoneNumberTypeInput('Home');
      expect(input.toAPIStructure()).toEqual({name: 'Home'});
    });
  });
});
