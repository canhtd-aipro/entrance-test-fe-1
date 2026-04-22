/* eslint-disable no-template-curly-in-string */
import { Form, FormProps } from 'antd';
import ErrorList from 'antd/es/form/ErrorList';
import { useForm, useWatch } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import FormList from 'antd/es/form/FormList';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import classNames from 'classnames';
import { FormProvider } from 'rc-field-form';
import type { FormRef, ValidateMessages } from 'rc-field-form/es/interface';
import { PropsWithChildren, RefAttributes, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TruncateTooltip } from '../truncate-tooltip/TruncateTooltip';
import { AppFormItemGroup } from './app-form-item-group/AppFormItemGroup';
import './styles.scss';

export type AppFormProps<Values = any> = PropsWithChildren<FormProps<Values>> & RefAttributes<FormRef<Values>>;

const InternalAppForm = <Values,>({ className, children, ...others }: AppFormProps<Values>) => {
  const { t } = useTranslation();

  const validateMessages: ValidateMessages = useMemo(() => {
    return {
      string: {
        max: t('common.max_length', { max: '${max}' }),
        range: t('common.range_length', { label: '${label}', min: '${min}', max: '${max}' }),
      },
      number: {
        max: t('common.exceeds_maximum_value'),
        range: t('common.range_number', { label: '${label}', min: '${min}', max: '${max}' }),
      },
      types: {
        url: t('common.please_enter_in_the_correct_format'),
      },
      whitespace: t('common.input_cannot_only_be_whitespace'),
    } satisfies ValidateMessages;
  }, [t]);

  return (
    <Form<Values>
      className={classNames('app-form', className)}
      validateMessages={validateMessages}
      layout="vertical"
      autoComplete="off"
      requiredMark={(label: React.ReactNode, { required }: { required: boolean }) => (
        <span className="inline-flex w-full items-center">
          {required && label && (
            <span className="vertical-text-bottom mr-4 h-fit whitespace-nowrap rounded-4 bg-primary_bg px-6 text-12 font-[500] text-primary">
              {t('common.required')}
            </span>
          )}
          <TruncateTooltip className="flex-1">{label || '　'}</TruncateTooltip>
        </span>
      )}
      validateTrigger={['onChange', 'onBlur']}
      {...others}
    >
      <>{children}</>
    </Form>
  );
};

type AppFormType = typeof InternalAppForm & {
  Item: typeof FormItem;
  ItemGroup: typeof AppFormItemGroup;
  List: typeof FormList;
  useForm: typeof useForm;
  useFormInstance: typeof useFormInstance;
  useWatch: typeof useWatch;
  ErrorList: typeof ErrorList;
  Provider: typeof FormProvider;
};

export const AppForm = InternalAppForm as AppFormType;

AppForm.Item = FormItem;
AppForm.ItemGroup = AppFormItemGroup;
AppForm.List = FormList;
AppForm.useForm = useForm;
AppForm.useFormInstance = useFormInstance;
AppForm.useWatch = useWatch;
AppForm.ErrorList = ErrorList;
AppForm.Provider = FormProvider;
