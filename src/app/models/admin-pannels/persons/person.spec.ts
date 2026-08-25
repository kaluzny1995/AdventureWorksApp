import { Person, PersonInput } from './person';
import { EPersonType } from './e-person-type';

describe('Person', () => {
  it('should create an instance', () => {
    expect(new Person(1, EPersonType.GC, 'False', null, 'John', null, 'Doe', null, 0, null, null, 'guid', new Date())).toBeTruthy();
  });

  it('should have correct properties', () => {
    const date = new Date('2024-01-01');
    const person = new Person(1, EPersonType.GC, 'False', 'Mr.', 'John', 'M', 'Doe', 'Jr.', 1, '<info>', '<demo>', 'guid123', date);
    expect(person.personId).toBe(1);
    expect(person.personType).toBe(EPersonType.GC);
    expect(person.title).toBe('Mr.');
    expect(person.firstName).toBe('John');
    expect(person.middleName).toBe('M');
    expect(person.lastName).toBe('Doe');
    expect(person.suffix).toBe('Jr.');
    expect(person.emailPromotion).toBe(1);
    expect(person.rowguid).toBe('guid123');
  });

  describe('personIdString', () => {
    it('should return string representation of id', () => {
      const person = new Person(42, EPersonType.GC, 'False', null, 'John', null, 'Doe', null, 0, null, null, 'guid', new Date());
      expect(person.personIdString).toBe('42');
    });
  });

  describe('fromAPIStructure', () => {
    it('should create instance from API data', () => {
      const data = {
        business_entity_id: 1,
        person_type: 'gc',
        name_style: false,
        title: 'Mr.',
        first_name: 'John',
        middle_name: 'M',
        last_name: 'Doe',
        suffix: 'Jr.',
        email_promotion: 1,
        additional_contact_info: '<info>',
        demographics: '<demo>',
        rowguid: 'guid123',
        modified_date: '2024-01-01T00:00:00'
      };
      const person = Person.fromAPIStructure(data);
      expect(person.personId).toBe(1);
      expect(person.personType).toBe(EPersonType.GC);
      expect(person.firstName).toBe('John');
      expect(person.lastName).toBe('Doe');
    });
  });

  describe('toMSListItem', () => {
    it('should format item name with all fields', () => {
      const person = new Person(1, EPersonType.GC, 'False', 'Mr.', 'John', 'M', 'Doe', 'Jr.', 0, null, null, 'guid', new Date());
      const item = person.toMSListItem();
      expect(item.id).toBe(1);
      expect(item.itemName).toBe('Doe John M Jr. (Mr.) - [1]');
    });

    it('should format item name without optional fields', () => {
      const person = new Person(1, EPersonType.GC, 'False', null, 'John', null, 'Doe', null, 0, null, null, 'guid', new Date());
      const item = person.toMSListItem();
      expect(item.itemName).toBe('Doe John - [1]');
    });
  });

  describe('toFormStructure', () => {
    it('should convert to form structure', () => {
      const person = new Person(1, EPersonType.GC, 'False', 'Mr.', 'John', 'M', 'Doe', 'Jr.', 1, '<info>', '<demo>', 'guid', new Date());
      const result = person.toFormStructure();
      expect(result).toEqual({
        personType: EPersonType.GC,
        nameStyle: 'False',
        title: 'Mr.',
        firstName: 'John',
        middleName: 'M',
        lastName: 'Doe',
        suffix: 'Jr.',
        emailPromotion: 1,
        additionalContactInfo: '<info>',
        demographics: '<demo>'
      });
    });
  });
});

describe('PersonInput', () => {
  it('should create an instance', () => {
    expect(new PersonInput(EPersonType.GC, 'False', null, 'John', null, 'Doe', null, 0, null, null)).toBeTruthy();
  });

  it('should have correct properties', () => {
    const input = new PersonInput(EPersonType.GC, 'False', 'Mr.', 'John', 'M', 'Doe', 'Jr.', 1, '<info>', '<demo>');
    expect(input.personType).toBe(EPersonType.GC);
    expect(input.firstName).toBe('John');
    expect(input.lastName).toBe('Doe');
  });

  describe('fromFormStructure', () => {
    it('should create instance from form data', () => {
      const data = {
        personType: EPersonType.GC,
        nameStyle: 'False',
        title: 'Mr.',
        firstName: 'John',
        middleName: 'M',
        lastName: 'Doe',
        suffix: 'Jr.',
        emailPromotion: 1,
        additionalContactInfo: null,
        demographics: null
      };
      const input = PersonInput.fromFormStructure(data);
      expect(input.firstName).toBe('John');
      expect(input.lastName).toBe('Doe');
    });
  });

  describe('toAPIStructure', () => {
    it('should convert to snake_case API format', () => {
      const input = new PersonInput(EPersonType.GC, 'False', null, 'John', null, 'Doe', null, 0, null, null);
      const result = input.toAPIStructure();
      expect(result).toEqual({
        person_type: EPersonType.GC,
        name_style: 'False',
        title: null,
        first_name: 'John',
        middle_name: null,
        last_name: 'Doe',
        suffix: null,
        email_promotion: 0,
        additional_contact_info: null,
        demographics: null
      });
    });
  });
});
