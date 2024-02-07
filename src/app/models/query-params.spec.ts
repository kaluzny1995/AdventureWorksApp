import { EOrderType } from './e-order-type';
import { QueryParams } from './query-params';

describe('UrlOptionalParams', () => {
  it('should create an instance', () => {
    expect(new QueryParams(0, 10, null, null, EOrderType.ASC)).toBeTruthy();
  });
});
