import { FormInstance, FormItemProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { InternalNamePath, NamePath } from 'antd/es/form/interface';
import { get } from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useCompareMemo } from '../../../../utils/use-compare-memo.util';
import { AppForm } from '../AppForm';
import { MultiFormItemRender, MultiFormItemRenderProps } from './multi-form-item-render/MultiFormItemRender';

type MultiFormItemProps<V = any> = Omit<FormItemProps<V>, 'name' | 'rules' | 'children' | 'normalize'> & {
  names: NamePath<V>[];
  children: React.ReactElement;
  items?: Array<Omit<FormItemProps<V>, 'name'>>;
};

export const MultiFormItem = <V,>({ names, children, items, ...rest }: MultiFormItemProps<V>) => {
  const form = useFormInstance();

  const [errors, setErrors] = useState<string[]>([]);

  const _names = useCompareMemo(names);
  const normalizedNames = useMemo(() => _names.map((n) => (Array.isArray(n) ? n : [n]) as InternalNamePath), [_names]);

  const isRequired = useMemo(() => {
    return items?.some(({ rules }) => rules?.some((r) => 'required' in r && r['required']));
  }, [items]);

  const prefixRef = useRef<NamePath>();

  const handlePrefixName = useCallback<NonNullable<MultiFormItemRenderProps['onPrefixName']>>(
    (prefixName) => (prefixRef.current = prefixName),
    [],
  );

  return (
    <AppForm.Item
      required={isRequired}
      validateStatus={errors.length ? 'error' : undefined}
      help={errors[0]}
      {...rest}
      shouldUpdate={(prev, curr) => {
        const hasChange = normalizedNames.some((namePath) => {
          const prevVal = get(prev, [...prefixRef.current, ...namePath]);
          const currVal = get(curr, [...prefixRef.current, ...namePath]);
          return prevVal !== currVal;
        });

        if (hasChange) {
          setErrors(
            normalizedNames
              .map((namePath) => form.getFieldError([...(form.prefixName ?? []), ...namePath]))
              .flat()
              .filter(Boolean),
          );
        }

        return hasChange;
      }}
    >
      {(form: FormInstance) => {
        const values = normalizedNames.map((namePath) => {
          return form.getFieldValue([...(form.prefixName ?? []), ...namePath]);
        });
        return (
          <MultiFormItemRender
            form={form}
            values={values}
            onPrefixName={handlePrefixName}
            names={normalizedNames}
            items={items}
          >
            {children}
          </MultiFormItemRender>
        );
      }}
    </AppForm.Item>
  );
};
