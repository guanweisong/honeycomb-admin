import { message } from 'antd';
import router from 'umi/router'
import * as loginService from './service';

export default {
  namespace: 'login',
  state: {},
  effects: {
    * login({ payload: values }, { call, put }) {
      console.log('login=>model=>login', values);
      const result = yield call(loginService.login, values);
      console.log(result);
      if (result.status === 200) {
        message.success('登陆成功');
        router.push('/');
      }
    },
  },
};
