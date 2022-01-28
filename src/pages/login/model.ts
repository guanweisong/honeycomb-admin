import { message } from 'antd';
import { history } from 'umi';
import { createModel } from 'hox';
import { useState } from 'react';
import * as loginService from './service';
import type { LoginRequest } from '@/pages/login/types/LoginRequest';

function UseLogin() {
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 登录
   */
  const login = async (props: { targetUrl: string } & LoginRequest) => {
    const { targetUrl, ...rest } = props;
    setLoading(true);
    loginService
      .login(rest)
      .then((response) => {
        if (response.data.OK) {
          message.success('登陆成功');
          history.replace(targetUrl || '/');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    loading,
    login,
  };
}

export default createModel(UseLogin);
