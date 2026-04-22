import { Select } from 'antd';
import { BaseOptionType, DefaultOptionType, SelectProps } from 'antd/es/select';
import { BaseSelectRef } from 'rc-select';
import { forwardRef, useCallback, useEffect } from 'react';
import { useStateRef } from '../../../utils/use-state-ref.util';
import './styles.scss';

export type AppSelectProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
> = SelectProps<ValueType, OptionType> & {
  nullable?: boolean;
};

export const AppSelect = forwardRef<BaseSelectRef, AppSelectProps>(
  ({ value, onChange, nullable = true, ...props }, ref) => {
    const onChangeRef = useStateRef(onChange);

    useEffect(() => {
      if (!nullable && value === null) {
        onChangeRef.current?.(undefined);
      }
    }, [nullable, value]);

    const handleChange = useCallback<NonNullable<AppSelectProps['onChange']>>(
      (value, option) => {
        onChange?.(value ?? (nullable ? null : undefined), option);
      },
      [nullable, onChange],
    );

    return (
      <Select
        ref={ref}
        value={value}
        onChange={handleChange}
        showSearch
        allowClear
        optionFilterProp="label"
        {...props}
      />
    );
  },
) as <ValueType = any, OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType>(
  props: React.PropsWithChildren<AppSelectProps<ValueType, OptionType>> & React.RefAttributes<BaseSelectRef>,
) => React.ReactElement;
