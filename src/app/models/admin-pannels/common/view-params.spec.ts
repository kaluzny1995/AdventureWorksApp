import { ViewParams } from './view-params';

describe('ViewParams', () => {
  it('should create an instance', () => {
    expect(new ViewParams(true, false, [10, 25], null, null, null)).toBeTruthy();
  });

  it('should have correct properties', () => {
    const vp = new ViewParams(true, false, [10, 25], '1', '2', '3');
    expect(vp.isColumnSetOn).toBeTrue();
    expect(vp.isFilterSetOn).toBeFalse();
    expect(vp.perPageOptions).toEqual([10, 25]);
    expect(vp.selectedId).toBe('1');
    expect(vp.newId).toBe('2');
    expect(vp.changedId).toBe('3');
  });
});
