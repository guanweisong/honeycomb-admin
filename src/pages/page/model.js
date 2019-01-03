import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as pagesService from './service';

export default {
  namespace: 'pages',
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
      console.log('pages=>model=>index', values);
      yield put({
        type: 'switchLoading',
        payload: true,
      });
      const result = yield call(pagesService.index, values);
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
    * detail({payload: values }, { call, put}) {
      console.log('pages=>model=>detial', values);
      let result;
      if (typeof values._id !== 'undefined') {
        result = yield call(pagesService.index, values);
        result = result.data.list[0];
      } else {
        result = {};
      }
      yield put({
        type: 'saveCurrentItem',
        payload: result,
      });
    },
    * distory({ payload: id }, { call, put }) {
      console.log('pages=>model=>distory', id);
      const result = yield call(pagesService.distory, id);
      if (result.status === 204) {
        yield put({ type: 'index', payload: {} });
        message.success('删除成功');
      }
    },
    * update({ payload: { id, values } }, { call, put }) {
      console.log('pages=>model=>update', id, values);
      const result = yield call(pagesService.update, id, values);
      if (result.status === 201) {
        message.success('更新成功');
        yield put(routerRedux.push({
          pathname: '/page/edit',
          query: {
            _id: id,
          },
        }))
      }
    },
    * create({ payload: values }, { call, put }) {
      console.log('pages=>model=>create', values);
      const result = yield call(pagesService.create, values);
      if (result.status === 201) {
        message.success('添加成功');
        yield put(routerRedux.push({
          pathname: '/page/edit',
          query: {
            _id: result.data._id,
          },
        }))
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history}) {
      return history.listen(({ pathname }) => {
        if (pathname === '/page/list') {
          dispatch({
            type: 'index',
            payload: history.location.query,
          });
        }
        if (pathname === '/page/edit') {
          dispatch({
            type: 'detail',
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
