import { Rule } from 'antd/es/form';
import { Store, StoreValue } from 'antd/es/form/interface';
import { t } from 'i18next';

export const phoneNumberFormValidator: Rule = {
  validator: (_, value) => {
    if (!value) return Promise.resolve();

    const digitsOnly = value.replace(/-/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 12) {
      return Promise.reject(new Error(t('common.phone_number_invalid')));
    }
    return Promise.resolve();
  },
};

export const phoneNumberFormNormalize = (value: StoreValue, prevValue: StoreValue, allValues: Store) => {
  if (!value) return '';
  let v = value.replace(/[^0-9-]/g, '');
  v = v.replace(/--+/g, '-');
  const digits = v.replace(/-/g, '').slice(0, 12);

  let result = '';
  let digitIndex = 0;
  for (const ch of v) {
    if (ch === '-') {
      result += '-';
    } else if (digitIndex < digits.length) {
      result += digits[digitIndex++];
    }
  }
  return result;
};
