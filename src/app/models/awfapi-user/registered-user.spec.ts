import { RegisteredUser } from './registered-user';

describe('RegisteredUser', () => {
  it('should create an instance', () => {
    const user = new RegisteredUser('testuser', 'pass123', 'pass123', 'Test User', 'test@test.com', false);
    expect(user).toBeTruthy();
  });

  it('should have correct properties', () => {
    const user = new RegisteredUser('testuser', 'pass123', 'pass123', 'Test User', 'test@test.com', true);
    expect(user.username).toBe('testuser');
    expect(user.password).toBe('pass123');
    expect(user.repeatedPassword).toBe('pass123');
    expect(user.fullName).toBe('Test User');
    expect(user.email).toBe('test@test.com');
    expect(user.isReadonly).toBeTrue();
  });

  describe('toAPIStructure', () => {
    it('should convert to snake_case API format', () => {
      const user = new RegisteredUser('testuser', 'pass123', 'pass123', 'Test User', 'test@test.com', false);
      const result = user.toAPIStructure();
      expect(result).toEqual({
        username: 'testuser',
        password: 'pass123',
        repeated_password: 'pass123',
        full_name: 'Test User',
        email: 'test@test.com',
        is_readonly: false
      });
    });
  });

  describe('fromFormStructure', () => {
    it('should create instance from form data', () => {
      const data = {
        username: 'testuser',
        password: 'pass123',
        repeatedPassword: 'pass123',
        fullName: 'Test User',
        email: 'test@test.com',
        isReadonly: true
      };
      const user = RegisteredUser.fromFormStructure(data);
      expect(user.username).toBe('testuser');
      expect(user.fullName).toBe('Test User');
      expect(user.isReadonly).toBeTrue();
    });
  });
});
