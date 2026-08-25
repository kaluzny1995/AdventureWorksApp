import { ViewParams } from './view-params';

describe('ViewParams', () => {
  it('should create an instance', () => {
    expect(new ViewParams(false, false, [], null, null, null)).toBeTruthy();
  });
});
