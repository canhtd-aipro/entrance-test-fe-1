import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NormalizeInput, NormalizeInputProps } from '../normalize-input/NormalizeInput';

export type NumberInputProps = Omit<NormalizeInputProps<number>, 'normalize'> & {
  integer?: boolean;
};

export const NumberInput: FC<NumberInputProps> = ({ integer, ...props }) => {
  const { t } = useTranslation();

  const toNumber = useCallback(
    (raw: string) => {
      let digits = raw.normalize('NFKC').replace(/[．｡。]/g, '.');

      if (integer) {
        digits = digits.replace(/[^0-9]/g, '');
      } else {
        digits = digits.replace(/[^0-9.]/g, '');
        const [intPart, ...rest] = digits.split('.');
        digits = intPart + (rest.length ? '.' + rest.join('') : '');
      }
      digits = digits.slice(0, 15);
      if (!digits) return null;

      return parseFloat(Number(digits).toFixed(3));
    },
    [integer],
  );

  const normalizeDisplay = useCallback((raw: string) => {
    return raw.replace(/[^0-9０-９.,．，、。]+/g, '');
  }, []);

  return (
    <NormalizeInput
      tooltipTitle={integer ? t('common.input_only_integer') : t('common.input_only_number')}
      normalize={toNumber}
      normalizeDisplay={normalizeDisplay}
      {...props}
    />
  );
};
