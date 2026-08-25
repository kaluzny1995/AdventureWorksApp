import { PersonPhone, PersonPhoneInput } from './person-phone';

describe('PersonPhone', () => {
  it('should create an instance', () => {
    expect(new PersonPhone(1, '555-1234', 2, new Date(), '/')).toBeTruthy();
  });

  it('should have correct properties', () => {
    const date = new Date('2024-01-01');
    const phone = new PersonPhone(1, '555-1234', 2, date, '/');
    expect(phone.personId).toBe(1);
    expect(phone.phoneNumber).toBe('555-1234');
    expect(phone.phoneNumberTypeId).toBe(2);
    expect(phone.modifiedDate).toBe(date);
    expect(phone.separator).toBe('/');
  });

  describe('personPhoneId', () => {
    it('should return tuple of [personId, phoneNumber, phoneNumberTypeId]', () => {
      const phone = new PersonPhone(1, '555-1234', 2, new Date(), '/');
      expect(phone.personPhoneId).toEqual([1, '555-1234', 2]);
    });
  });

  describe('personPhoneIdString', () => {
    it('should return concatenated string with separator', () => {
      const phone = new PersonPhone(1, '555-1234', 2, new Date(), '/');
      expect(phone.personPhoneIdString).toBe('1/555-1234/2');
    });

    it('should work with different separator', () => {
      const phone = new PersonPhone(1, '555-1234', 2, new Date(), '-');
      expect(phone.personPhoneIdString).toBe('1-555-1234-2');
    });
  });

  describe('fromAPIStructure', () => {
    it('should create instance from API data', () => {
      const data = {
        business_entity_id: 1,
        phone_number: '555-1234',
        phone_number_type_id: 2,
        modified_date: '2024-01-01T00:00:00'
      };
      const phone = PersonPhone.fromAPIStructure(data, '/');
      expect(phone.personId).toBe(1);
      expect(phone.phoneNumber).toBe('555-1234');
      expect(phone.phoneNumberTypeId).toBe(2);
      expect(phone.modifiedDate).toEqual(new Date('2024-01-01T00:00:00'));
    });
  });

  describe('toFormStructure', () => {
    it('should convert to form structure', () => {
      const date = new Date('2024-01-01');
      const phone = new PersonPhone(1, '555-1234', 2, date, '/');
      expect(phone.toFormStructure()).toEqual({
        personId: 1,
        phoneNumber: '555-1234',
        phoneNumberTypeId: 2,
        modifiedDate: date
      });
    });
  });
});

describe('PersonPhoneInput', () => {
  it('should create an instance', () => {
    expect(new PersonPhoneInput(1, '555-1234', 2)).toBeTruthy();
  });

  it('should have correct properties', () => {
    const input = new PersonPhoneInput(1, '555-1234', 2);
    expect(input.personId).toBe(1);
    expect(input.phoneNumber).toBe('555-1234');
    expect(input.phoneNumberTypeId).toBe(2);
  });

  describe('fromFormStructure', () => {
    it('should create instance from form data', () => {
      const data = {personId: 1, phoneNumber: '555-1234', phoneNumberTypeId: 2};
      const input = PersonPhoneInput.fromFormStructure(data);
      expect(input.personId).toBe(1);
      expect(input.phoneNumber).toBe('555-1234');
    });
  });

  describe('toAPIStructure', () => {
    it('should convert to snake_case API format', () => {
      const input = new PersonPhoneInput(1, '555-1234', 2);
      expect(input.toAPIStructure()).toEqual({
        business_entity_id: 1,
        phone_number: '555-1234',
        phone_number_type_id: 2
      });
    });
  });
});
