import { message } from 'antd';
import { ReactNode } from 'react';
import { apiNotify } from './api-notify/apiNotify';
import { useTranslation } from 'react-i18next';

export type NotifyOptions = {
  duration?: number;
};

type NotifyType = (content: string, options?: NotifyOptions) => void;

export const notify: {
  info: NotifyType;
  success: NotifyType;
  error: NotifyType;
  warning: NotifyType;
  loading: NotifyType;
} = {
  info: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  loading: () => {},
};

type NotifyProviderProps = {
  children?: ReactNode;
};

export const NotifyProvider: React.FC<NotifyProviderProps> = ({ children }) => {
  const { t } = useTranslation();

  notify.info = (content: string, options = {}) => {
    message.info(content, options.duration);
  };
  notify.success = (content: string, options = {}) => {
    message.success(content, options.duration);
  };
  notify.error = (content: string, options = {}) => {
    message.error(content, options.duration);
  };
  notify.warning = (content: string, options = {}) => {
    message.warning(content, options.duration);
  };

  apiNotify.error = (code: string) => {
    message.error(t(`api_error.${code}`));
  };

  return <>{children}</>;
};
