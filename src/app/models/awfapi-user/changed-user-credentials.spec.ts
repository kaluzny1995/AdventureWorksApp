import { ChangedUserCredentials } from './changed-user-credentials';

describe('ChangedUserCredentials', () => {
  it('should create an instance', () => {
    expect(new ChangedUserCredentials(null, '', null, null)).toBeTruthy();
  });

  it('should have correct properties', () => {
    const creds = new ChangedUserCredentials('newuser', 'currentpass', 'newpass', 'newpass');
    expect(creds.newUsername).toBe('newuser');
    expect(creds.currentPassword).toBe('currentpass');
    expect(creds.newPassword).toBe('newpass');
    expect(creds.repeatedPassword).toBe('newpass');
  });

  describe('toAPIStructure', () => {
    it('should convert to snake_case API format', () => {
      const creds = new ChangedUserCredentials('newuser', 'currentpass', 'newpass', 'newpass');
      const result = creds.toAPIStructure();
      expect(result).toEqual({
        new_username: 'newuser',
        current_password: 'currentpass',
        new_password: 'newpass',
        repeated_password: 'newpass'
      });
    });
  });

  describe('fromAPIStructure', () => {
    it('should create instance from API data', () => {
      const data = {
        new_username: 'newuser',
        current_password: 'currentpass',
        new_password: 'newpass',
        repeated_password: 'newpass'
      };
      const creds = ChangedUserCredentials.fromAPIStructure(data);
      expect(creds.newUsername).toBe('newuser');
      expect(creds.currentPassword).toBe('currentpass');
    });
  });

  describe('fromFormStructure', () => {
    it('should create instance from form data', () => {
      const data = {
        newUsername: 'newuser',
        currentPassword: 'currentpass',
        newPassword: 'newpass',
        repeatedPassword: 'newpass'
      };
      const creds = ChangedUserCredentials.fromFormStructure(data);
      expect(creds.newUsername).toBe('newuser');
      expect(creds.currentPassword).toBe('currentpass');
    });
  });
});
