import { message } from 'antd';
import * as commentsService from './service';

export default {
  namespace: 'comments',
  state: {
    list: [],
    total: null,
    loading: false,
  },
  effects: {
    * index({ payload: values }, { call, put }) {
      console.log('comments=>model=>index', values);
      yield put({
        type: 'switchLoading',
        payload: true,
      });
      const result = yield call(commentsService.index, values);
      yield put({
        type: 'saveListData',
        payload: {
          list: result.data.list,
          total: result.data.total,
        },
      });
      yield put({
        type: 'switchLoading',
        payload: false,
      });
    },
    * update({ payload: { id, values } }, { call, put }) {
      console.log('comments=>model=>update', id, values);
      const result = yield call(commentsService.update, id, values);
      if (result.status === 201) {
        yield put({ type: 'index', payload: {} });
        message.success('更新成功');
      }
    },
    * distory({ payload: id }, { call, put }) {
      console.log('comments=>model=>distory', id);
      const result = yield call(commentsService.distory, id);
      if (result.status === 204) {
        yield put({ type: 'index', payload: {} });
        message.success('删除成功');
      }
    },
    * checkExist({ payload: values }, { call, select }) {
      console.log('comments=>model=>checkExist', values);
      let exist = false;
      const result = yield call(commentsService.index, values);
      const currentId = yield select(state => state.comments.currentItem._id);
      if (result.data.total > 0 && result.data.list[0]._id !== currentId) {
        exist = true;
      }
      return exist;
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/comment') {
          dispatch({
            type: 'index',
            payload: history.location.query,
          });
        }
      });
    },
  },
  reducers: {
    saveListData(state, { payload: { list, total } }) {
      return { ...state, list, total };
    },
    switchLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
  },
};
