import { MenuItemGroupType, MenuItemType, SubMenuType } from 'antd/es/menu/interface';

export type AppExtraItemProps = {
  hidden?: boolean;
  back?: boolean;
};

export type AppMenuItemType = MenuItemType & AppExtraItemProps;

export type AppSubMenuType<T extends AppMenuItemType = AppMenuItemType> = SubMenuType &
  AppExtraItemProps & {
    children: AppItemType<T>[];
  };
export type AppMenuItemGroupType<T extends AppMenuItemType = AppMenuItemType> = MenuItemGroupType &
  AppExtraItemProps & {
    children?: AppItemType<T>[];
  };

export type AppItemType<T extends AppMenuItemType = AppMenuItemType> = T | AppSubMenuType<T> | AppMenuItemGroupType<T>;
