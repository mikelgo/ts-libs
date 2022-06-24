// todo as function and as decorator

function defaultComparatorFn(a: any, b: any): boolean {
  if (a instanceof Array) {
    return a.length === b.length && a.every((fromA) => b.includes(fromA));
  }
  // Default comparison
  return a === b;
}

export function memoize(  projectionFn: AnyFn,
                          comparatorFn?: ComparatorFn): any {
  return resultMemoize(projectionFn, comparatorFn ?? defaultComparatorFn);
}


export type AnyFn = (...args: any[]) => any;

export type MemoizedProjection = {
  memoized: AnyFn;
  reset: () => void;
  setResult: (result?: any) => void;
  clearResult: () => void;
};

export type MemoizeFn = (t: AnyFn) => MemoizedProjection;

export type ComparatorFn = (a: any, b: any) => boolean;

export type DefaultProjectorFn<T> = (...args: any[]) => T;

export function isEqualCheck(a: any, b: any): boolean {
  return a === b;
}

function isArgumentsChanged(
  args: IArguments,
  lastArguments: IArguments,
  comparator: ComparatorFn
) {
  for (let i = 0; i < args.length; i++) {
    if (!comparator(args[i], lastArguments[i])) {
      return true;
    }
  }
  return false;
}

export function resultMemoize(
  projectionFn: AnyFn,
  isResultEqual: ComparatorFn
) {
  return defaultMemoize(projectionFn, isEqualCheck, isResultEqual);
}

export function defaultMemoize(
  projectionFn: AnyFn,
  isArgumentsEqual = isEqualCheck,
  isResultEqual = isEqualCheck
): MemoizedProjection {
  let lastArguments: null | IArguments = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, , , , ,
  let lastResult: any = null;
  let overrideResult: any;

  function reset() {
    lastArguments = null;
    lastResult = null;
  }

  function setResult(result: any = undefined) {
    overrideResult = {result};
  }

  function clearResult() {
    overrideResult = undefined;
  }

  /* eslint-disable prefer-rest-params, prefer-spread */

  // disabled because of the use of `arguments`
  function memoized(): any {
    if (overrideResult !== undefined) {
      return overrideResult.result;
    }

    if (!lastArguments) {
      lastResult = projectionFn.apply(null, arguments as any);
      lastArguments = arguments;
      return lastResult;
    }

    if (!isArgumentsChanged(arguments, lastArguments, isArgumentsEqual)) {
      return lastResult;
    }

    const newResult = projectionFn.apply(null, arguments as any);
    lastArguments = arguments;

    if (isResultEqual(lastResult, newResult)) {
      return lastResult;
    }

    lastResult = newResult;

    return newResult;
  }

  return {memoized, reset, setResult, clearResult};

}
