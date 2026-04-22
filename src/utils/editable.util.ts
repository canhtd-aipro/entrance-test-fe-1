import { isArray, isObject, mergeWith, union } from 'lodash';

export const deepMerge = <T extends Record<string, any>, U extends Record<string, any>>(
  target: T,
  source: U,
): T & U => {
  return mergeWith({}, target, source, (objValue, srcValue) => {
    if (!srcValue || isArray(srcValue)) return srcValue;
  });
};

export const deepDiff = <T>(prev: T, next: T): Partial<T> | undefined => {
  if (prev === next) return undefined;

  if (isArray(next)) return next;

  if (isObject(prev) && isObject(next)) {
    const result: Record<string, any> = {};

    for (const key of union(Object.keys(prev), Object.keys(next))) {
      // @ts-ignore
      const diff = deepDiff(prev[key], next[key]);
      if (diff !== undefined) result[key] = diff;
    }

    return result as Partial<T>;
  }

  // arrays, primitives, type changes
  return next;
};
