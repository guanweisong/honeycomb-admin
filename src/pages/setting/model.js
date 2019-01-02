import { message } from 'antd';
import * as tagsService from './service';

export default {
  namespace: 'settings',
  state: {},
  effects: {
    * update({ payload }, { call, put }) {
      console.log('settings=>model=>update', payload);
      const result = yield call(tagsService.update, payload);
      if (result.status === 201) {
        yield put({ type: 'app/querySetting', payload: {} });
        message.success('更新成功');
      }
    },
  },
};
