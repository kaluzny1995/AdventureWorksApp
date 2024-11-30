import { ChangedUserData } from './changed-user-data';

describe('ChangedUserData', () => {
  it('should create an instance', () => {
    expect(new ChangedUserData('', '', false)).toBeTruthy();
  });
});
