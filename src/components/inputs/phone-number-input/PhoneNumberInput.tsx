import { FC, useCallback } from 'react';
import { NormalizeInput, NormalizeInputProps } from '../normalize-input/NormalizeInput';

export type PhoneNumberInputProps = Omit<NormalizeInputProps<string>, 'normalize'>;

export const PhoneNumberInput: FC<PhoneNumberInputProps> = (props) => {
  const toPhoneNumber = useCallback((raw: string) => {
    if (!raw) return '';
    return raw
      .normalize('NFKC')
      .replace(/[^0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, []);

  const normalizeDisplay = useCallback((raw: string) => {
    return raw.replace(/[^0-9０-９\-－]+/g, '');
  }, []);

  return <NormalizeInput normalize={toPhoneNumber} normalizeDisplay={normalizeDisplay} {...props} />;
};
