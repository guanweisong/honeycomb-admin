import { message } from 'antd';
import * as usersService from './service';

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    currentItem: {},
    showModal: false,
    modalType: 0, // 0:增加,1:修改
  },
  effects: {
    * index({ payload: values }, { call, put }) {
      console.log('users=>model=>index', values);
      const result = yield call(usersService.index, values);
      yield put({
        type: 'saveListData',
        payload: {
          list: result.data.list,
          total: result.data.total,
        },
      });
    },
    * distory({ payload: id }, { call, put }) {
      console.log('users=>model=>distory', id);
      const result = yield call(usersService.distory, id);
      if (result.status === 204) {
        yield put({ type: 'index', payload: {} });
        message.success('删除成功');
      }
    },
    * update({ payload: { id, values } }, { call, put }) {
      console.log('users=>model=>update', id, values);
      const result = yield call(usersService.update, id, values);
      if (result.status === 201) {
        yield put({ type: 'index', payload: {} });
        message.success('更新成功');
      }
    },
    * create({ payload: values }, { call, put }) {
      console.log('users=>model=>create', values);
      const result = yield call(usersService.create, values);
      if (result.status === 201) {
        yield put({ type: 'index', payload: {} });
        message.success('添加成功');
      }
    },
    * checkExist({ payload: values }, { call, select }) {
      console.log('users=>model=>checkExist', values);
      let exist = false;
      const result = yield call(usersService.index, values);
      const currentId = yield select(state => state.users.currentItem._id);
      if (result.data.total > 0 && result.data.list[0]._id !== currentId) {
        exist = true;
      }
      return exist;
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/user') {
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
  },
};
