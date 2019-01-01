import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as postsService from './service';

export default {
  namespace: 'posts',
  state: {
    list: [],
    total: null,
    currentItem: {},
    showModal: false,
    modalType: 0, // 0:增加,1:修改
  },
  effects: {
    * index({ payload: values }, { call, put }) {
      console.log('posts=>model=>index', values);
      const result = yield call(postsService.index, values);
      yield put({
        type: 'saveListData',
        payload: {
          list: result.data.list,
          total: result.data.total,
        },
      });
    },
    * detail({payload: values }, { call, put}) {
      console.log('posts=>model=>detial', values);
      let result;
      if (typeof values.id !== 'undefined') {
        result = yield call(postsService.index, values);
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
      console.log('posts=>model=>distory', id);
      const result = yield call(postsService.distory, id);
      if (result.status === 204) {
        yield put({ type: 'index', payload: {} });
        message.success('删除成功');
      }
    },
    * update({ payload: { id, values } }, { call, put }) {
      console.log('posts=>model=>update', id, values);
      const result = yield call(postsService.update, id, values);
      if (result.status === 201) {
        message.success('更新成功');
        yield put(routerRedux.push({
          pathname: '/post/edit',
          query: {
            id,
          },
        }))
      }
    },
    * create({ payload: values }, { call, put }) {
      console.log('posts=>model=>create', values);
      const result = yield call(postsService.create, values);
      if (result.status === 201) {
        message.success('添加成功');
        yield put(routerRedux.push({
          pathname: '/post/edit',
          query: {
            id: result.data._id,
          },
        }))
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history}) {
      return history.listen(({ pathname }) => {
        if (pathname === '/post/list') {
          dispatch({
            type: 'index',
            payload: history.location.query,
          });
        }
        if (pathname === '/post/edit') {
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
  },
};
