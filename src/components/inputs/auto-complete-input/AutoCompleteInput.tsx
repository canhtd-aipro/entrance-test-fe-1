import { AutoComplete, AutoCompleteProps } from 'antd';
import Select, { BaseOptionType, DefaultOptionType } from 'antd/es/select';
import { useMemo } from 'react';
import { BaseEntity } from '../../../types/entities/_base.entity';
import { AutoCompleteConfig, AutoCompleteRequestType, useAutoComplete } from '../../../utils/use-auto-complete.util';
import { useConditionalHook } from '../../../utils/use-conditional-hook.util';

export type AutoCompleteInputProps<
  E extends Record<string, any> = BaseEntity,
  R extends AutoCompleteRequestType<E, L> = any,
  L extends string = R extends AutoCompleteRequestType<E, infer L> ? L : never,
  ValueType = string,
  OptionType extends BaseOptionType | DefaultOptionType = E,
> = AutoCompleteProps<ValueType, OptionType> & {
  children?: React.ReactNode;
  autoComplete?: {
    request: R;
    config?: AutoCompleteConfig<E, L>;
  };
};

export type AutoCompleteInputType = <
  E extends Record<string, any> = BaseEntity,
  R extends AutoCompleteRequestType<E, L> = any,
  L extends string = R extends AutoCompleteRequestType<E, infer L> ? L : never,
  ValueType = string,
  OptionType extends BaseOptionType | DefaultOptionType = E,
>(
  props: AutoCompleteInputProps<E, R, L, ValueType, OptionType>,
) => React.ReactElement;

export const AutoCompleteInput: AutoCompleteInputType = ({ children, autoComplete, ...others }) => {
  const [data, contextHolder] = useConditionalHook(Boolean(autoComplete?.request), useAutoComplete, [
    autoComplete?.request,
    autoComplete?.config,
  ] as any);

  const { options, ...props } = useMemo(() => {
    if (!data) return others;

    const handleSearch = (value: string) => data.setKeyword(value);

    const handleFocus: AutoCompleteProps['onFocus'] = (e) => {
      others.onFocus?.(e);
      data.setKeyword(undefined);
    };

    return {
      ...others,
      options: data.options,
      loading: data.loading,
      onSearch: handleSearch,
      onFocus: handleFocus,
    };
  }, [data, others]);

  return (
    <>
      {contextHolder}
      <AutoComplete
        labelRender={({ label }) => label ?? <></>}
        optionFilterProp="label"
        filterOption={false}
        {...props}
      >
        <>
          {options?.map((e) => (
            <Select.Option key={e.value} value={e.value} {...e}>
              {e.label}
            </Select.Option>
          )) ?? children}
        </>
      </AutoComplete>
    </>
  );
};
