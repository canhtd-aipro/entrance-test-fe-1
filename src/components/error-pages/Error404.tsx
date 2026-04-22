import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Error404: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Result
      status="404"
      title={t('common.page_not_found')}
      extra={
        <Link to="/">
          <Button type="primary">{t('common.back_home')}</Button>
        </Link>
      }
    />
  );
};

export default Error404;
