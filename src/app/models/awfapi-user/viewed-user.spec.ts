import { ViewedUser } from './viewed-user';

describe('ViewedUser', () => {
  it('should create an instance', () => {
    expect(new ViewedUser('', '', '', false, new Date(), new Date())).toBeTruthy();
  });
});
