import { ChangedUserData } from './changed-user-data';

describe('ChangedUserData', () => {
  it('should create an instance', () => {
    expect(new ChangedUserData('', '', false)).toBeTruthy();
  });

  it('should have correct properties', () => {
    const data = new ChangedUserData('Test User', 'test@test.com', true);
    expect(data.fullName).toBe('Test User');
    expect(data.email).toBe('test@test.com');
    expect(data.isReadonly).toBeTrue();
  });

  describe('equals', () => {
    it('should return true for equal instances', () => {
      const data1 = new ChangedUserData('Test', 'test@test.com', true);
      const data2 = new ChangedUserData('Test', 'test@test.com', true);
      expect(data1.equals(data2)).toBeTrue();
    });

    it('should return false when fullName differs', () => {
      const data1 = new ChangedUserData('Test1', 'test@test.com', true);
      const data2 = new ChangedUserData('Test2', 'test@test.com', true);
      expect(data1.equals(data2)).toBeFalse();
    });

    it('should return false when email differs', () => {
      const data1 = new ChangedUserData('Test', 'a@test.com', true);
      const data2 = new ChangedUserData('Test', 'b@test.com', true);
      expect(data1.equals(data2)).toBeFalse();
    });

    it('should return false when isReadonly differs', () => {
      const data1 = new ChangedUserData('Test', 'test@test.com', true);
      const data2 = new ChangedUserData('Test', 'test@test.com', false);
      expect(data1.equals(data2)).toBeFalse();
    });
  });

  describe('toAPIStructure', () => {
    it('should convert to snake_case API format', () => {
      const data = new ChangedUserData('Test User', 'test@test.com', true);
      const result = data.toAPIStructure();
      expect(result).toEqual({
        full_name: 'Test User',
        email: 'test@test.com',
        is_readonly: true
      });
    });
  });

  describe('fromAPIStructure', () => {
    it('should create instance from API data', () => {
      const apiData = {
        full_name: 'Test User',
        email: 'test@test.com',
        is_readonly: true
      };
      const data = ChangedUserData.fromAPIStructure(apiData);
      expect(data.fullName).toBe('Test User');
      expect(data.email).toBe('test@test.com');
      expect(data.isReadonly).toBeTrue();
    });
  });

  describe('fromFormStructure', () => {
    it('should create instance from form data', () => {
      const formData = {
        fullName: 'Test User',
        email: 'test@test.com',
        isReadonly: true
      };
      const data = ChangedUserData.fromFormStructure(formData);
      expect(data.fullName).toBe('Test User');
      expect(data.email).toBe('test@test.com');
      expect(data.isReadonly).toBeTrue();
    });
  });
});
