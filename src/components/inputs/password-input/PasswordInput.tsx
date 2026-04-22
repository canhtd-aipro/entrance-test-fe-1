import { Input } from 'antd';
import { PasswordProps } from 'antd/es/input';
import { FC } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export const PasswordInput: FC<PasswordProps> = (props) => {
  return <Input.Password iconRender={(visible) => <div>{visible ? <FiEye /> : <FiEyeOff />}</div>} {...props} />;
};
