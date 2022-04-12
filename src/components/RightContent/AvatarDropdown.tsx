import React, { useCallback } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Menu, Spin, message } from 'antd';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { UserLevel, UserLevelName } from '@/pages/user/types/UserLevel';
import * as LoginService from '@/pages/login/service';

const AvatarDropdown: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(async (event: MenuInfo) => {
    const { key } = event;
    if (key === 'logout') {
      setInitialState((s) => ({ ...s, userInfo: undefined }));
      const result = await LoginService.logout();
      if (result.status === 200 && result.data.OK) {
        message.success('登出成功');
        localStorage.removeItem('token');
        history.push('/login');
      }
      return;
    }
  }, []);

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { userInfo } = initialState;

  if (!userInfo) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <span className={`${styles.name} anticon`}>
          欢迎 {UserLevelName[UserLevel[userInfo.user_level]]}: {userInfo.user_name}
        </span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
