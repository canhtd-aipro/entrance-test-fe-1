import FieldContext from 'rc-field-form/es/FieldContext';
import type { InternalFormInstance, NamePath } from 'rc-field-form/es/interface';
import { getNamePath } from 'rc-field-form/es/utils/valueUtil';
import { FC, PropsWithChildren, useContext, useMemo } from 'react';

export type AppFormItemGroupProps = {
  name: NamePath;
};

export const AppFormItemGroup: FC<PropsWithChildren<AppFormItemGroupProps>> = ({ name, children }) => {
  const context = useContext(FieldContext);

  const fieldContext = useMemo<InternalFormInstance>(() => {
    const prefixName = [...(getNamePath(context.prefixName) || []), ...getNamePath(name)];
    return { ...context, prefixName };
  }, [context, name]);

  return <FieldContext.Provider value={fieldContext}>{children}</FieldContext.Provider>;
};
