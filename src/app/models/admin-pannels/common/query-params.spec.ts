import { QueryParams } from './query-params';
import { EOrderType } from './e-order-type';

describe('QueryParams', () => {
  it('should create an instance', () => {
    expect(new QueryParams(1, 10, null, null, EOrderType.ASC)).toBeTruthy();
  });

  it('should have correct properties', () => {
    const qp = new QueryParams(2, 25, {name: 'val'}, 'firstName', EOrderType.DESC);
    expect(qp.page).toBe(2);
    expect(qp.perPage).toBe(25);
    expect(qp.filters).toEqual({name: 'val'});
    expect(qp.orderBy).toBe('firstName');
    expect(qp.type).toBe(EOrderType.DESC);
  });
});
