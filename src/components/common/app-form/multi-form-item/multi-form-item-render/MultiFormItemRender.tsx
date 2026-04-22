import { FormItemProps } from 'antd';
import { NamePath } from 'antd/es/form/interface';
import { FormInstance, InternalNamePath } from 'rc-field-form/es/interface';
import { cloneElement, ReactElement, useCallback, useLayoutEffect, useMemo } from 'react';
import { useCompareMemo } from '../../../../../utils/use-compare-memo.util';
import { useGeneratedRef } from '../../../../../utils/use-generated-ref.util';
import { useStateRef } from '../../../../../utils/use-state-ref.util';
import { AppForm } from '../../AppForm';
import { MultiFormItemInput, MultiFormItemInputRef } from './multi-form-item-input/MultiFormItemInput';

export type MultiFormItemRenderProps<V = any> = {
  form: FormInstance<V>;
  names: InternalNamePath[];
  values: any[];
  onPrefixName: (prefixName?: InternalNamePath) => void;
  children: ReactElement;
  items?: Array<Omit<FormItemProps<V>, 'name'>>;
};

export const MultiFormItemRender = <V,>({
  form,
  names,
  values,
  onPrefixName,
  children,
  items,
}: MultiFormItemRenderProps<V>) => {
  const _prefixName = useMemo(() => form.prefixName ?? [], [form.prefixName]);
  const prefixName = useCompareMemo(_prefixName);

  const onChangeRef = useStateRef(children.props.onChange);
  const inputsRef = useGeneratedRef<Array<MultiFormItemInputRef | null>>(() => Array(names.length).fill(undefined));

  useLayoutEffect(() => {
    onPrefixName(prefixName);
  });

  const handleChange = useCallback(
    (newValues: any[]) => {
      names.forEach((namePath, i) => {
        inputsRef.current[i]?.onChange?.(newValues[i]);
      });

      onChangeRef.current?.(newValues);
    },
    [names],
  );

  const _children = useMemo(
    () =>
      children &&
      cloneElement(children, {
        value: values,
        onChange: handleChange,
      }),
    [children, handleChange, values],
  );

  return (
    <>
      {_children}
      {names.map((namePath, i) => (
        <AppForm.Item<V> key={i} name={namePath as NamePath<V>} {...items?.[i]} noStyle>
          <MultiFormItemInput
            ref={(ref) => {
              inputsRef.current[i] = ref;
            }}
          />
        </AppForm.Item>
      ))}
    </>
  );
};
