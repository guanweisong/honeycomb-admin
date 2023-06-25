'use client';

import proLayoutProps from '@/constants/proLayoutProps';
import { useSettingStore } from '@/stores/useSettingStore';
import { useUserStore } from '@/stores/useUserStore';
import { LogoutOutlined } from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { Dropdown, message } from 'antd';
import { useRouter } from 'next/navigation';
import * as LoginService from '../login/service';

export default ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const userStore = useUserStore();
  const settingStore = useSettingStore();

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

  return (
    <ProLayout
      {...proLayoutProps}
      layout="mix"
      title={setting?.siteName}
      menuProps={{ onSelect: handleMenuSelect }}
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
