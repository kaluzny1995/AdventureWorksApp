import { ViewedUser } from './viewed-user';

describe('ViewedUser', () => {
  it('should create an instance', () => {
    expect(new ViewedUser('', '', '', false, new Date(), new Date())).toBeTruthy();
  });

  it('should have correct properties', () => {
    const date = new Date('2024-01-01');
    const user = new ViewedUser('testuser', 'Test User', 'test@test.com', true, date, date);
    expect(user.username).toBe('testuser');
    expect(user.fullName).toBe('Test User');
    expect(user.email).toBe('test@test.com');
    expect(user.isReadonly).toBeTrue();
    expect(user.dateCreated).toBe(date);
    expect(user.dateModified).toBe(date);
  });

  describe('fromAPIStructure', () => {
    it('should create instance from API data', () => {
      const data = {
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@test.com',
        is_readonly: true,
        date_created: '2024-01-01T00:00:00',
        date_modified: '2024-01-02T00:00:00'
      };
      const user = ViewedUser.fromAPIStructure(data);
      expect(user.username).toBe('testuser');
      expect(user.fullName).toBe('Test User');
      expect(user.isReadonly).toBeTrue();
      expect(user.dateCreated).toEqual(new Date('2024-01-01T00:00:00'));
    });

    it('should handle falsy is_readonly', () => {
      const data = {
        username: 'testuser',
        full_name: 'Test User',
        email: 'test@test.com',
        is_readonly: 0,
        date_created: '2024-01-01',
        date_modified: '2024-01-01'
      };
      const user = ViewedUser.fromAPIStructure(data);
      expect(user.isReadonly).toBeFalse();
    });
  });
});
