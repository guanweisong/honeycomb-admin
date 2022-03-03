import * as appService from '@/services/app';
import { history } from 'umi';
import { message } from 'antd';
import { createModel } from 'hox';
import { useState } from 'react';
import type { UserEntity } from '@/pages/user/types/user.entity';

function UseApp() {
  const [user, setUser] = useState<UserEntity | false>();

  const queryUser = async () => {
    console.log('app=>model=>verify');
    if (!localStorage.getItem('token')) {
      setUser(false);
      return;
    }
    appService
      .queryUser()
      .then((result) => {
        setUser(result.data ?? false);
      })
      .catch(() => {
        setUser(false);
      });
  };

  const logout = async () => {
    console.log('app=>model=>logout');
    const result = await appService.logout();
    if (result.status === 200 && result.data.OK) {
      message.success('登出成功');
      localStorage.removeItem('token');
      setUser(false);
      history.push('/login');
    }
  };

  return {
    user,
    queryUser,
    logout,
  };
}

export default createModel(UseApp);
