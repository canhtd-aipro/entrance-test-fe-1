import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Error403: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Result
      status="403"
      title={t('common.permission_denied')}
      extra={
        <Link to="/">
          <Button type="primary">{t('common.back_home')}</Button>
        </Link>
      }
    />
  );
};

export default Error403;
