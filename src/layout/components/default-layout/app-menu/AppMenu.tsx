import { Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { ItemType } from 'antd/es/menu/interface';
import { MenuProps } from 'antd/lib';
import { pathToRegexp } from 'path-to-regexp';
import { FC, useCallback, useMemo, useState } from 'react';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import { TruncateTooltip } from '../../../../components/common/truncate-tooltip/TruncateTooltip';
import { VITE_HIDDEN_PAGE_KEYS } from '../../../../constants/env-key.constant';
import { AppItemType } from '../../../../types/utils/layout.type';
import './styles.scss';
import { Icon } from '../../../../components/icon/Icon';

type AppMenuProps = {
  menuItems: AppItemType[];
};
const hiddenPageKeys: string[] = import.meta.env[VITE_HIDDEN_PAGE_KEYS]?.split(',') ?? [];

export const AppMenu: FC<AppMenuProps> = ({ menuItems }) => {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<React.Key[]>([]);

  const filteredMenuItems = useMemo(() => {
    const filterVisibleMenuItems = (items: AppItemType[]): AppItemType[] => {
      return items
        .map((item) => {
          const { key, hidden } = item;

          const checkValid = () => {
            if (hidden) {
              return false;
            }
            if (hiddenPageKeys.includes(key as string)) {
              return false;
            }
            return true;
          };

          if (!checkValid()) {
            return null;
          }

          const newItem: AppItemType = {
            ...item,
            label: (
              <div className="flex">
                <TruncateTooltip className="relative !m-0 block flex-1 text-13 font-[400]">
                  {item.label}
                </TruncateTooltip>
              </div>
            ),
          };

          if ('children' in newItem && newItem.children) {
            const filteredChildren = filterVisibleMenuItems(newItem.children as AppItemType[]);
            if (filteredChildren.length > 0) {
              newItem.children = filteredChildren;
            } else {
              if (newItem.key?.toString().startsWith('/')) {
                delete newItem.children;
              } else {
                return null;
              }
            }
          }
          return newItem;
        })
        .filter(Boolean) as AppItemType[];
    };

    return filterVisibleMenuItems(menuItems);
  }, [menuItems]);

  const selectedKeys = useMemo(() => {
    const selectedKeys: string[] = [];
    const openKeys: string[] = [];
    const { pathname } = location;

    const match = (menuItem: ItemType) => {
      if (!menuItem) {
        return false;
      }

      if ('children' in menuItem && menuItem.children) {
        const sortedChildren = [...menuItem.children].sort((a, b) => String(b?.key).length - String(a?.key).length);

        if (sortedChildren.some(match)) {
          openKeys.push(menuItem.key as string);
          return true;
        }
      } else if (menuItem.key) {
        const { regexp } = pathToRegexp(String(menuItem.key), { end: false });

        if (regexp.test(pathname)) {
          selectedKeys.push(menuItem.key as string);
          return true;
        }
      }

      return false;
    };

    filteredMenuItems.some(match);
    if (!collapsed) {
      setOpenKeys([...openKeys]);
    }
    return selectedKeys;
  }, [location, filteredMenuItems, collapsed]);

  const mappedItems = useMemo(() => {
    const mapper = (item: AppItemType): AppItemType => {
      if ('children' in item && item.children) {
        return {
          ...item,
          children: item.children.map(mapper),
        };
      }
      return {
        ...item,
        label: (
          <Link className="text-13 font-[400]" to={String(item.key)}>
            {item.label}
          </Link>
        ),
      };
    };

    return filteredMenuItems.map(mapper);
  }, [filteredMenuItems]);

  const parentMap = useMemo(() => {
    const map = new Map<string, string>();

    const build = (items: any[], parentKey?: string) => {
      items.forEach((item) => {
        if (parentKey) map.set(item.key, parentKey);
        if (item.children) build(item.children, item.key);
      });
    };

    build(menuItems);
    return map;
  }, [menuItems]);

  const getParentChain = useCallback(
    (key: string) => {
      const chain = [key];
      let current = key;

      while (parentMap.has(current)) {
        const parent = parentMap.get(current)!;
        chain.push(parent);
        current = parent;
      }

      return chain.reverse();
    },
    [parentMap],
  );

  const handleOpenKeys: MenuProps['onOpenChange'] = (nextOpenKeys) => {
    const latestOpenKey = nextOpenKeys.find((key) => !openKeys.includes(key));
    const selected = selectedKeys?.[0];

    if (!latestOpenKey) {
      setOpenKeys(nextOpenKeys);
      return;
    }

    if (!selected) {
      const parentChain = getParentChain(latestOpenKey);
      setOpenKeys(parentChain);
      return;
    }

    const selectedChain = getParentChain(selected);

    const parentOfLatest = parentMap.get(latestOpenKey);
    let matchedLevelIndex = -1;

    selectedChain.forEach((chainKey, idx) => {
      const chainParent = parentMap.get(chainKey);
      if (chainParent === parentOfLatest) {
        matchedLevelIndex = idx;
      }
    });

    if (matchedLevelIndex === -1) {
      const parentChain = getParentChain(latestOpenKey);
      setOpenKeys(parentChain);
      return;
    }

    const final = new Set<string>();

    selectedChain.forEach((k) => final.add(k));

    final.add(latestOpenKey);

    const finalOpenKeys = nextOpenKeys.filter((key) => {
      if (selectedChain.includes(key)) return true;

      const parent = parentMap.get(key);

      const isSameLevel = parent === parentMap.get(selectedChain[matchedLevelIndex]);

      if (isSameLevel) {
        return key === latestOpenKey;
      }

      return true;
    });

    setOpenKeys(finalOpenKeys);
  };

  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={
          <div className="border-0 border-t-1 border-solid border-border !bg-white text-black">
            {collapsed ? <AiOutlineMenuUnfold className="text-15" /> : <AiOutlineMenuFold className="text-15" />}
          </div>
        }
        className="z-[100] shadow-lg"
        width="12.5rem"
      >
        <div className="bg-white px-19 py-24">
          {collapsed ? (
            <Icon name="DaimaruIcon" />
          ) : (
            <div className="flex items-center whitespace-nowrap">
              <Icon name="DaimaruIcon" />
              <div className="ml-8 text-22">TODO APP</div>
            </div>
          )}
        </div>
        <div className="flex h-full flex-1 flex-col justify-between bg-white pb-60">
          <Menu
            mode="inline"
            theme="light"
            items={mappedItems}
            className="menubar mt-0 overflow-auto !border-0 font-[700]"
            selectedKeys={selectedKeys as string[]}
            openKeys={openKeys as string[]}
            onOpenChange={handleOpenKeys}
          />
        </div>
      </Sider>
    </>
  );
};
