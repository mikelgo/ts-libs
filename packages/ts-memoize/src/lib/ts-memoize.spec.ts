import {memoize, resultMemoize} from './ts-memoize';

describe('memoize', () => {

  it('should calculate only twice',  () => {


    function isResultEqual(a: any, b: any) {
      if (a instanceof Array) {
        return a.length === b.length && a.every((fromA) => b.includes(fromA));
      }
      // Default comparison
      return a === b;
    }
    const projectionFnSpy = jest.fn().mockReturnValue((a: number, b: number) => a+b);

    const memoizer = resultMemoize(projectionFnSpy, isResultEqual);

    memoizer.memoized(1, 1);
    memoizer.memoized(1, 1);
    memoizer.memoized(1, 22);
    memoizer.memoized(1, 22);
    memoizer.memoized(1, 22);
    memoizer.memoized(1, 22);

    expect(projectionFnSpy).toHaveBeenCalledTimes(2)
  });
});
