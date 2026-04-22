import { InternalNamePath } from 'rc-field-form/es/interface';
import { ValueType } from 'rc-input/lib/interface';
import { HTMLTextareaProps } from 'rc-textarea/lib/interface';

declare module 'antd' {
  interface InputProps {
    value?: ValueType | null;
  }
  interface FormInstance {
    prefixName?: InternalNamePath;
  }
}

declare module 'rc-field-form/es/interface' {
  interface FormInstance {
    prefixName?: InternalNamePath;
  }
}

declare module 'antd/es/input' {
  interface TextAreaProps {
    value?: HTMLTextareaProps['value'] | bigint | null;
  }
}
