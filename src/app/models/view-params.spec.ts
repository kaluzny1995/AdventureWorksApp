import { ViewParams } from './view-params';

describe('ViewParams', () => {
  it('should create an instance', () => {
    expect(new ViewParams(false, false, [], 0, 0, 0)).toBeTruthy();
  });
});
