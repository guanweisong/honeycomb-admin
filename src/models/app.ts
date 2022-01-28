import * as appService from '@/services/app';
import { history } from 'umi';
import { message } from 'antd';
import { createModel } from 'hox';
import { useState } from 'react';
import type { UserEntity } from '@/pages/user/types/user.entity';

function UseApp() {
  const [user, setUser] = useState<UserEntity>();

  const verify = async () => {
    console.log('app=>model=>verify');
    if (user?._id) {
      return;
    }
    appService
      .verify()
      .then((result) => {
        setUser(result.data);
      })
      .catch(() => {
        setUser(undefined);
      });
  };

  const logout = async () => {
    console.log('app=>model=>logout');
    const result = await appService.logout();
    if (result.status === 200 && result.data.OK) {
      message.success('登出成功');
      setUser(undefined);
      history.push('/login');
    }
  };

  return {
    user,
    verify,
    logout,
  };
}

export default createModel(UseApp);
