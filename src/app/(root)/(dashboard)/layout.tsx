'use client';

import { route } from '@/constants/menuData';
import { useSettingStore } from '@/stores/useSettingStore';
import { useUserStore } from '@/stores/useUserStore';
import { LogoutOutlined } from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { Dropdown, message } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import LoginService from '../login/service';

export interface MenuItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export default ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const userStore = useUserStore();
  const settingStore = useSettingStore();
  const pathname = usePathname();

  const { setting } = settingStore;
  const { user, setUser } = userStore;

  /**
   * 菜单选中事件
   * @param key
   */
  const handleMenuSelect = ({ key }: { key: string }) => {
    console.log('onMenuChange', key);
    router.push(key);
  };

  /**
   * 退出登录
   */
  const handleLogout = async () => {
    const result = await LoginService.logout();
    if (result.status === 201 && result.data.isOk) {
      message.success('登出成功');
      localStorage.removeItem('token');
      setUser(false);
      router.push('/login');
    }
  };

  /**
   * 扁平化菜单
   */
  const treeToList = (data: MenuItem[]) => {
    const arr: MenuItem[] = [];
    const formatData = (data: MenuItem[]) => {
      data.forEach((item) => {
        arr.push({ path: item.path, name: item.name });
        if (item.children) {
          formatData(item.children);
        }
      });
    };
    formatData(data);
    return arr;
  };

  const flatMenu = treeToList(route.children as MenuItem[]);

  /**
   * 预加载菜单
   */
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      flatMenu.forEach((item) => {
        router.prefetch(item.path);
      });
    }
  }, []);

  return (
    <ProLayout
      logo="/logo.jpg"
      route={route}
      layout="mix"
      title={setting?.siteName}
      pageTitleRender={false}
      breadcrumbRender={() => []}
      menuProps={{
        onSelect: handleMenuSelect,
        selectedKeys: [pathname],
      }}
      footerRender={() => (
        <div className="text-gray-400 text-center pb-6">{setting?.siteSignature}</div>
      )}
      waterMarkProps={{
        // @ts-ignore
        content: user.name,
      }}
      avatarProps={{
        src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        size: 'small',
        // @ts-ignore
        title: user.name,
        render: (props, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: '退出登录',
                    onClick: handleLogout,
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
    >
      {children}
    </ProLayout>
  );
};
