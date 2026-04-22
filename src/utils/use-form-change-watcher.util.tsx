import { FormInstance } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { debounce, pick } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { isDifferent } from './is-different.util';
import { useGeneratedRef } from './use-generated-ref.util';

export type UseFormChangeWatcherOptions<T extends object = any, P extends T = any> = {
  properties?: (keyof T)[];
  transform?: (values: T) => P;
  debounce?: boolean;
};

export const useFormChangeWatcher = <T extends object = any, P extends T = any>(
  form: FormInstance<T>,
  initialValues?: P,
  { debounce: _debounce = true, properties, transform }: UseFormChangeWatcherOptions = {},
) => {
  const [isEdited, setIsEdited] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [values, setValues] = useState<T | undefined>(initialValues);

  const timeRef = useGeneratedRef(() => ({ formChanged: 0, setValues: 0 }));

  const debounceSetValues = useMemo(
    () =>
      debounce(
        (values: T) => {
          const pickedValues = properties ? pick(values, properties) : values;
          const transformedValues = transform ? transform(pickedValues) : pickedValues;
          setValues(transformedValues);
          timeRef.current.setValues = Date.now();
        },
        _debounce ? 400 : 0,
      ),
    [_debounce, properties, transform],
  );

  useWatch((values) => {
    timeRef.current.formChanged = Date.now();
    debounceSetValues(values);
  }, form);

  useEffect(() => {
    if (timeRef.current.setValues < timeRef.current.formChanged) return;
    setIsEdited(isDifferent(initialValues, values, properties));
  }, [initialValues, properties, transform, values]);

  const validate = useMemo(
    () =>
      debounce(
        async () => {
          try {
            if (properties) await form.validateFields(properties, { validateOnly: true });
            else await form.validateFields({ validateOnly: true });
            setIsValidated(true);
          } catch {
            setIsValidated(false);
          }
        },
        _debounce ? 10 : 0,
      ),
    [_debounce, form, properties],
  );

  useEffect(() => {
    validate();
  }, [validate, values]);

  return useMemo(
    () => ({
      isEdited,
      isValidated,
    }),
    [isEdited, isValidated],
  );
};
