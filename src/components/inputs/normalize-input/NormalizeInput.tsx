import { Input, InputProps, Tooltip } from 'antd';
import { debounce } from 'lodash';
import { ReactNode, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useStateRef } from '../../../utils/use-state-ref.util';

export type Normalize<T> = (raw: string) => T | null;

export type NormalizeInputProps<T> = Omit<InputProps, 'value' | 'onChange'> & {
  value?: T | null;
  normalize: Normalize<T>;
  normalizeDisplay?: (raw: string) => string;
  onChange?: (value?: T | null) => void;
  onDisplayValueChange?: (value: string) => void;
  tooltipZIndex?: number;
  tooltipTitle?: ReactNode | null;
};

export const NormalizeInput = <T,>({
  value,
  normalize,
  normalizeDisplay,
  onChange,
  onFocus,
  onBlur,
  onDisplayValueChange,
  tooltipZIndex = 100,
  tooltipTitle,
  ...props
}: NormalizeInputProps<T>) => {
  const [_value, setValue] = useState<T | null | undefined>(value ?? null);
  const [inputValue, setInputValue] = useState<string>(() => (value ? String(value) : ''));
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const ultimateValue = useMemo(() => (value !== undefined ? value : _value), [_value, value]);

  const displayValue = useMemo(() => {
    if (isEditing) return inputValue;

    return ultimateValue !== null ? String(ultimateValue) : '';
  }, [inputValue, isEditing, ultimateValue]);

  const normalizeDisplayRef = useStateRef(normalizeDisplay);

  const debounceNormalizeInputValue = useMemo(
    () => debounce(() => setInputValue((prev) => normalizeDisplayRef.current?.(prev) ?? prev), 400),
    [],
  );

  useLayoutEffect(() => {
    debounceNormalizeInputValue();
  }, [inputValue, debounceNormalizeInputValue]);

  useLayoutEffect(() => {
    onDisplayValueChange?.(displayValue);
  }, [displayValue, onDisplayValueChange]);

  const handleChange = useCallback<NonNullable<InputProps['onChange']>>(
    (e) => {
      const val = e.target.value;
      const normalized = normalize(val);
      setValue(normalized);
      onChange?.(normalized);
      setInputValue(val);
    },
    [onChange, normalize],
  );

  const handleFocus = useCallback<NonNullable<InputProps['onFocus']>>(
    (e) => {
      setInputValue(ultimateValue ? String(ultimateValue) : '');
      setIsEditing(true);
      onFocus?.(e);
    },
    [onFocus, ultimateValue],
  );

  const handleBlur = useCallback<NonNullable<InputProps['onBlur']>>(
    (e) => {
      setIsEditing(false);
      onBlur?.(e);
      const normalized = normalize(inputValue);
      setValue(normalized);
      onChange?.(normalized);
    },
    [inputValue, onBlur, onChange, normalize],
  );

  return (
    <Tooltip title={tooltipTitle} open={isEditing && Boolean(tooltipTitle)} zIndex={tooltipZIndex}>
      <Input value={displayValue} {...props} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
    </Tooltip>
  );
};
