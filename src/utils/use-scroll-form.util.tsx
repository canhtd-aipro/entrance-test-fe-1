import { FormInstance } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { isArray } from 'lodash';
import type { ValidateOptions } from 'rc-field-form/es/interface';

const patchValidateFieldsScroll = <T,>(form: FormInstance<T>) => {
  const original = form.validateFields.bind(form);

  form.validateFields = async (...args) => {
    let options: ValidateOptions | undefined;
    if (args[1]) {
      options = args[1];
    } else {
      options = args[0] as ValidateOptions;
    }
    try {
      // @ts-ignore
      return await original(...args);
    } catch (errorInfo: any) {
      if (!options?.validateOnly && errorInfo?.errorFields?.length) {
        const { name } = errorInfo.errorFields[0];
        const id = isArray(name) ? name.join('_') : name;
        const element = (document.querySelector(`td:has(#${id})`) ??
          document.querySelector(`.ant-form-item:has(#${id}):not(.not-selected)`) ??
          document.getElementById(id)) as HTMLElement;

        let scroller: HTMLElement | null = element;
        while (scroller && scroller !== document.body) {
          const style = getComputedStyle(scroller);
          if (/(auto|scroll|overlay)/.test(style.overflowY)) break;
          scroller = scroller.parentElement;
        }

        if (scroller && element) {
          scroller.scrollTo({
            top:
              element.getBoundingClientRect().top -
              scroller.getBoundingClientRect().top +
              scroller.scrollTop -
              scroller.clientHeight / 2 +
              element.clientHeight / 2,
            behavior: 'smooth',
          });
        }
      }
      throw errorInfo;
    }
  };

  return form;
};

export const useScrollForm = <T,>(): [FormInstance<T>] => {
  const [form] = useForm<T>();
  return [patchValidateFieldsScroll(form)];
};
