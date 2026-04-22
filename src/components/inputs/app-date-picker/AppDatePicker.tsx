import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTimeFormat } from '../../../enums/date-time-format.enum';
import { datetime } from '../../../utils/datetime.util';
import { useStateRef } from '../../../utils/use-state-ref.util';
import './styles.scss';

export type AppDatePickerProps = Omit<DatePickerProps, 'value' | 'onChange'> & {
  value?: string | null;
  onChange?: (value?: string | null) => void;
  nullable?: boolean;
  valueFormat?: string;
  displayFormat?: string;
};

export const AppDatePicker: FC<AppDatePickerProps> = ({
  value,
  onChange,
  nullable = true,
  className,
  valueFormat,
  displayFormat,
  placeholder,
  disabled,
  ...others
}) => {
  const { t } = useTranslation();

  const format = useMemo(() => valueFormat ?? displayFormat, [valueFormat, displayFormat]);

  const valueDate = useMemo(() => {
    if (format === DateTimeFormat.DateTimeValue) {
      return value ? datetime(value) : undefined;
    }
    return value ? datetime(value, format) : undefined;
  }, [format, value]);

  const onChangeRef = useStateRef(onChange);

  useEffect(() => {
    if (!nullable && value === null) {
      onChangeRef.current?.(undefined);
    }
  }, [nullable, value]);

  const handleChange: DatePickerProps['onChange'] = (date: Dayjs | null) => {
    if (!date) {
      onChange?.(nullable ? null : undefined);
      return;
    }
    if (format === DateTimeFormat.DateTimeValue) {
      onChange?.(date.toISOString());
    } else {
      onChange?.(date.format(format));
    }
  };

  const _placeholder = useMemo(
    () => (disabled ? '' : (placeholder ?? t('placeholder.date'))),
    [disabled, placeholder, t],
  );

  return (
    <DatePicker
      className={classNames('app-date-picker', className)}
      value={valueDate}
      onChange={handleChange}
      format={displayFormat}
      disabled={disabled}
      {...others}
      placeholder={_placeholder}
    />
  );
};
