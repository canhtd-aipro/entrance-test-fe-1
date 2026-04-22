import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useStateRef } from './use-state-ref.util';

type UseHook<T extends Array<any>, R> = (...parameters: [...T]) => R;

const HookHolder = <T extends Array<any>, R>({
  useHook,
  parameters,
  onChange,
}: {
  useHook: UseHook<T, R>;
  parameters: T;
  onChange: (data: R) => void;
}): ReactElement => {
  const data = useHook(...parameters);

  const setData = useCallback(() => {
    onChange(data);
  }, [onChange, data]);

  useEffect(() => {
    setData();
  }, [setData]);

  return <></>;
};

export const useConditionalHook = <T extends Array<any>, R>(
  condition: boolean,
  useHook: UseHook<T, R>, // dynamically more
  parameters: T = [] as any,
): [undefined | R, ReactElement, boolean] => {
  const [data, setData] = useState<R>();
  const [loaded, setLoaded] = useState(false);

  const useHookRef = useStateRef(useHook);

  useEffect(() => {
    if (!condition) {
      setData(undefined);
    }
  }, [condition]);

  const handleChange = useCallback((data: R) => {
    setLoaded(true);
    setData(data);
  }, []);

  const contextHolder = useMemo(() => {
    if (condition) {
      return <HookHolder useHook={useHookRef.current} parameters={parameters} onChange={handleChange} />;
    } else {
      return <></>;
    }
  }, [condition, handleChange, parameters]);

  return useMemo(() => [data, contextHolder, loaded], [contextHolder, data, loaded]);
};
