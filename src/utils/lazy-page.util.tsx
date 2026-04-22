import { Suspense, ComponentType, lazy, CustomComponentPropsWithRef } from 'react';
import { Loading } from '../components/loading/Loading';

export const lazyPage = <T extends ComponentType<any>>(
  load: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <Loading />,
) => {
  const Component = lazy(load);

  return (props: CustomComponentPropsWithRef<T>) => (
    <Suspense fallback={fallback}>
      <Component {...(props as any)} />
    </Suspense>
  );
};
