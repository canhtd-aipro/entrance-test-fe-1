import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsListCheck } from 'react-icons/bs';
import { IoListOutline } from 'react-icons/io5';
import { Outlet } from 'react-router-dom';
import { AppItemType } from '../../types/utils/layout.type';
import { DefaultLayout } from '../components/default-layout/DefaultLayout';

export const AppLayout: React.FC = () => {
  const { t } = useTranslation();

  const menuItems = useMemo(() => {
    return [
      {
        key: '/categories',
        label: t('layout.categories'),
        icon: <IoListOutline />,
      },
      {
        key: '/todos',
        label: t('layout.todos'),
        icon: <BsListCheck />,
      },
    ] satisfies AppItemType[];
  }, [t]);

  return (
    <DefaultLayout menuItems={menuItems}>
      <Outlet />
    </DefaultLayout>
  );
};
