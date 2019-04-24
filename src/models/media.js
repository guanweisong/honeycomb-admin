import { message } from 'antd';
import * as mediaService from '@/services/media';

export default {
  namespace: 'media',
  state: {
    list: [],
    total: null,
    currentItem: {},
    tab: 'all',
    showModal: false,
    loading: false,
  },
  effects: {
    * index({ payload: values }, { call, put }) {
      console.log('media=>model=>index', values);
      const result = yield call(mediaService.index, values);
      yield put({
        type: 'saveListData',
        payload: {
          list: result.data.list,
          total: result.data.total,
        },
      });
    },
    * distory({ payload: id }, { call, put }) {
      console.log('media=>model=>distory', id);
      const result = yield call(mediaService.distory, id);
      if (result.status === 204) {
        yield put({ type: 'index', payload: {} });
        yield put({ type: 'saveCurrentItem', payload: {} })
        message.success('删除成功');
      }
    },
    * update({ payload: { id, values } }, { call, put }) {
      console.log('media=>model=>update', id, values);
      const result = yield call(mediaService.update, id, values);
      if (result.status === 201) {
        yield put({ type: 'index', payload: {} });
        message.success('更新成功');
      }
    },
    * create({ payload: values }, { call, put }) {
      console.log('media=>model=>create', values);
      const result = yield call(mediaService.create, values);
      if (result.status === 201) {
        yield put({ type: 'index', payload: {} });
        message.success('添加成功');
      }
    },
  },
  subscriptions: {},
  reducers: {
    saveListData(state, { payload: { list, total } }) {
      return { ...state, list, total };
    },
    saveCurrentItem(state, { payload }) {
      return { ...state, currentItem: payload };
    },
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    setCurrentTab(state, {payload}) {
      return { ...state, tab: payload};
    }
  },
};
