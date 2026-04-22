import { Layout } from 'antd';
import { FC, ReactNode } from 'react';
import { AppItemType } from '../../../types/utils/layout.type';
import { AppMenu } from './app-menu/AppMenu';
import './styles.scss';

type DefaultLayoutProps = {
  children: ReactNode;
  menuItems: AppItemType[];
};

export const DefaultLayout: FC<DefaultLayoutProps> = ({ children, menuItems }) => {
  return (
    <Layout className="default-layout min-h-[100dvh]">
      <AppMenu menuItems={menuItems} />
      <Layout>
        <Layout.Content className="main-content relative">{children}</Layout.Content>
      </Layout>
    </Layout>
  );
};
