import * as appService from '@/services/app.js';
import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'app',
  state: {
    user: {},
  },
  effects: {
    * verify({}, { select, call, put }) {
      console.log('app=>model=>verify');
      const user = yield select(state => state.app.user);
      if (user._id) {
        return;
      }
      const result = yield call(appService.verify);
      if (result.status === 200 ) {
        yield put({
          type: 'setUserInfo',
          payload: result.data.list[0],
        });
        // router.push('/dashboard');
      }
    },
    * logout({payload}, { call, put }) {
      console.log('app=>model=>logout');
      const result = yield call(appService.logout);
      if (result.status === 204) {
        message.success('登出成功');
        yield put({
          type: 'setUserInfo',
          payload: {},
        });
        router.push('/login');
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        dispatch({
          type: 'verify',
          payload: {},
        });
      });
    },
  },
  reducers: {
    setUserInfo(state, { payload: values }) {
      return { ...state, user: values };
    },
  },
};
