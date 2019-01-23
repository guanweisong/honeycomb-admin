import * as appService from '@/services/app.js';
import router from 'umi/router';
import { message } from 'antd';
export default {
  namespace: 'app',
  state: {
    user: {},
    setting: {},
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
    },
    * querySetting({ payload: values }, {select, call, put }) {
      console.log('app=>model=>querySetting');
      const setting = yield select(state => state.app.setting);
      if (setting._id) {
        return;
      }
      const result = yield call(appService.setSettingInfo);
      yield put({
        type: 'setSettingInfo',
        payload: result.data,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname !== '/login') {
          dispatch({
            type: 'verify',
            payload: {},
          });
          dispatch({
            type: 'querySetting',
            payload: {},
          });
        }
      });
    },
  },
  reducers: {
    setUserInfo(state, { payload: values }) {
      return { ...state, user: values };
    },
    setSettingInfo(state, { payload }) {
      return { ...state, setting: payload };
    },
  },
};
