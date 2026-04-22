import { useLayoutEffect, useRef } from 'react';

export const useStateRef = <T,>(state: T) => {
  const ref = useRef(state);

  useLayoutEffect(() => {
    ref.current = state;
  }, [state]);

  return ref;
};
