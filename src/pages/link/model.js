import { message } from 'antd';
import * as linksService from './service';

export default {
  namespace: 'links',
  state: {
    list: [],
    total: null,
    currentItem: {},
    showModal: false,
    modalType: 0, // 0:增加,1:修改
    loading: false,
  },
  effects: {
    * index({ payload: values }, { call, put }) {
      console.log('links=>model=>index', values);
      yield put({
        type: 'switchLoading',
        payload: true,
      });
      const result = yield call(linksService.index, values);
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
    * distory({ payload: id }, { call, put }) {
      console.log('links=>model=>distory', id);
      const result = yield call(linksService.distory, id);
      if (result.status === 204) {
        yield put({ type: 'index', payload: {} });
        message.success('删除成功');
      }
    },
    * update({ payload: { id, values } }, { call, put }) {
      console.log('links=>model=>update', id, values);
      const result = yield call(linksService.update, id, values);
      if (result.status === 201) {
        yield put({ type: 'index', payload: {} });
        message.success('更新成功');
      }
    },
    * create({ payload: values }, { call, put }) {
      console.log('links=>model=>create', values);
      const result = yield call(linksService.create, values);
      if (result.status === 201) {
        yield put({ type: 'index', payload: {} });
        message.success('添加成功');
      }
    },
    * checkExist({ payload: values }, { call, select }) {
      console.log('links=>model=>checkExist', values);
      let exist = false;
      const result = yield call(linksService.index, values);
      const currentId = yield select(state => state.links.currentItem._id);
      if (result.data.total > 0 && result.data.list[0]._id !== currentId) {
        exist = true;
      }
      return exist;
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/link') {
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
    saveCurrentItem(state, { payload }) {
      return { ...state, currentItem: payload };
    },
    setModalShow(state) {
      return { ...state, showModal: true };
    },
    setModalHide(state) {
      return { ...state, showModal: false };
    },
    switchModalType(state, { payload }) {
      return { ...state, modalType: payload };
    },
    switchLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
  },
};
