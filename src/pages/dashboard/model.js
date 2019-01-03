import * as statisticsService from './service';
export default {
  namespace: 'statistics',
  state: {},
  effects: {
    * index({}, { select, call, put }) {
      console.log('statistics=>model=>index');
      const result = yield call(statisticsService.index);
      if (result.status === 200 ) {
        yield put({
          type: 'setData',
          payload: result.data,
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/dashboard') {
          dispatch({
            type: 'index',
            payload: history.location.query,
          });
        }
      });
    },
  },
  reducers: {
    setData(state, { payload: values }) {
      return values;
    },
  },
};
