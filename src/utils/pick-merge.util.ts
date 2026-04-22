import { isEmpty, isPlainObject, transform } from 'lodash';

export const pickMerge = <U extends object, T extends Partial<U>>(template: T, data: U): T => {
  return transform(
    template as any,
    (acc: any, tplVal: any, key: string) => {
      const dataVal = (data as any)?.[key];

      if (isPlainObject(tplVal)) {
        const nested = pickMerge(tplVal, dataVal || {});
        if (!isEmpty(nested)) acc[key] = nested;
      } else {
        if (key in data) acc[key] = dataVal;
      }
    },
    {},
  ) as T;
};
