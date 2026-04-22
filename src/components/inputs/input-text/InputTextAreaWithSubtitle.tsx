import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { FC, ReactNode } from 'react';

type InputTextAreaWithSubtitleProps = {
  subtitle?: ReactNode;
} & TextAreaProps;

export const InputTextAreaWithSubtitle: FC<InputTextAreaWithSubtitleProps> = ({ subtitle, ...props }) => {
  return (
    <span>
      <span>{subtitle}</span>
      <Input.TextArea {...props} />
    </span>
  );
};
