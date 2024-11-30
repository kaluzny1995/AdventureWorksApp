import { ChangedUserCredentials } from './changed-user-credentials';

describe('ChangedUserCredentials', () => {
  it('should create an instance', () => {
    expect(new ChangedUserCredentials(null, '', null, null)).toBeTruthy();
  });
});
