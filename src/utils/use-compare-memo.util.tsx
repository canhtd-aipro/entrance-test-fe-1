import { isEqual } from 'lodash';
import { useMemo, useRef } from 'react';

export const useCompareMemo = <T,>(value: T) => {
  const ref = useRef(value);

  const memo = useMemo(() => {
    if (!isEqual(ref.current, value)) {
      ref.current = value;
    }
    return ref.current;
  }, [value]);

  return memo;
};
