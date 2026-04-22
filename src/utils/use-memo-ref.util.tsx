import { DependencyList, useLayoutEffect, useMemo, useRef } from 'react';

export const useMemoRef = <T,>(factory: () => T, deps: DependencyList) => {
  // eslint-disable-next-line @grncdr/react-hooks/exhaustive-deps
  const memo = useMemo(factory, deps);

  const ref = useRef(memo);

  useLayoutEffect(() => {
    ref.current = memo;
  }, [memo]);

  return ref;
};
