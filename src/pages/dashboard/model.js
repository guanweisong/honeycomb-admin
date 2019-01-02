import * as statisticsService from './service';
export default {
  namespace: 'statistics',
  state: {
    data: {},
  },
  effects: {
    * index({}, { select, call, put }) {
      console.log('statistics=>model=>index');
      const result = yield call(statisticsService.index);
      if (result.status === 200 ) {
        yield put({
          type: 'setData',
          payload: result.data.list[0],
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
      return { ...state, data: values };
    },
  },
};
