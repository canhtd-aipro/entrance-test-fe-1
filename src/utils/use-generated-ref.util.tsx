import { MutableRefObject, useRef } from 'react';

export const useGeneratedRef = <T,>(factory: () => T) => {
  const ref = useRef<T>();

  if (ref.current === undefined) {
    ref.current = factory();
  }

  return ref as MutableRefObject<T>;
};
