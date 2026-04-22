import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import { FC, useEffect, useMemo } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { DateTimeFormat } from '../../../enums/date-time-format.enum';
import { datetime } from '../../../utils/datetime.util';
import { useStateRef } from '../../../utils/use-state-ref.util';
import './styles.scss';

const { RangePicker } = DatePicker;

type ValueItem = string | null | undefined;

export type AppRangePickerProps = Omit<RangePickerProps, 'value' | 'onChange'> & {
  value?: [ValueItem, ValueItem] | null;
  onChange?: (value?: [ValueItem, ValueItem] | null) => void;
  nullable?: boolean;
  valueFormat?: string;
  displayFormat?: string;
};

export const AppRangePicker: FC<AppRangePickerProps> = ({
  className,
  value,
  onChange,
  nullable = true,
  valueFormat,
  displayFormat,
  picker,
  ...others
}) => {
  const format = useMemo(() => valueFormat ?? displayFormat, [valueFormat, displayFormat]);

  const valueDate = useMemo(() => {
    if (!value) {
      return null;
    }
    if (format === DateTimeFormat.DateTimeValue) {
      return value.map((v) => (v ? datetime(v) : null)) as [Dayjs | null, Dayjs | null];
    }
    return value.map((v) => (v ? datetime(v, format) : null)) as [Dayjs | null, Dayjs | null];
  }, [value, format]);

  const onChangeRef = useStateRef(onChange);

  useEffect(() => {
    if (!nullable && (value?.[0] === null || value?.[1] === null)) {
      onChangeRef.current?.([value[0] ?? undefined, value[1] ?? undefined]);
    }
  }, [nullable, value]);

  const handleChange: RangePickerProps['onChange'] = (dates) => {
    const emptyValue = nullable ? null : undefined;

    if (!dates) {
      onChange?.([emptyValue, emptyValue]);
      return;
    }
    let [start, end] = dates;

    if (picker === 'date') {
      start = start?.startOf('date') ?? null;
      end = end?.endOf('date') ?? null;
    } else if (picker === 'month') {
      start = start?.startOf('month') ?? null;
      end = end?.endOf('month') ?? null;
    } else if (picker === 'year') {
      start = start?.startOf('year') ?? null;
      end = end?.endOf('year') ?? null;
    }

    start = start?.startOf('day') ?? null;
    end = end?.endOf('day') ?? null;

    const formatted: [ValueItem, ValueItem] = [
      start ? (format === DateTimeFormat.DateTimeValue ? start.toISOString() : start.format(format)) : emptyValue,
      end ? (format === DateTimeFormat.DateTimeValue ? end.toISOString() : end.format(format)) : emptyValue,
    ];
    onChange?.(formatted);
  };

  return (
    <RangePicker
      className={classNames('app-range-picker', className)}
      value={valueDate}
      separator={<BsArrowRight />}
      onChange={handleChange}
      format={displayFormat}
      picker={picker}
      {...others}
    />
  );
};
