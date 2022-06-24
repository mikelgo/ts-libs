import { tsMemoize } from './ts-memoize';

describe('tsMemoize', () => {
  it('should work', () => {
    expect(tsMemoize()).toEqual('ts-memoize');
  });
});
