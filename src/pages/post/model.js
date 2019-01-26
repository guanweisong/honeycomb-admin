import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as postsService from './service';
import * as tagsService from '../tag/service';

export default {
  namespace: 'posts',
  state: {
    list: [],
    total: null,
    currentItem: {},
    showModal: false,
    modalType: 0, // 0:增加,1:修改
    loading: false,
    showPhotoPicker: false,
    insertPhotoType: '',
    detail: {
      gallery_style: [],
      movie_director: [],
      movie_actor: [],
      movie_style: [],
      post_cover: {},
      movie_photo: {},
      post_category: '0',
    },
  },
  effects: {
    * index({ payload: values }, { call, put }) {
      console.log('posts=>model=>index', values);
      yield put({
        type: 'switchLoading',
        payload: true,
      });
      const result = yield call(postsService.index, values);
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
      console.log('posts=>model=>detial', values);
      let result;
      if (typeof values._id !== 'undefined') {
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
            _id: id,
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
            _id: result.data._id,
          },
        }))
      }
    },
    * createTag ({ payload }, { select, call, put }) {
      console.log('posts=>model=>createTag', payload);
      const result = yield call(tagsService.create, { tag_name: payload.tag_name });
      const tags =  yield select(state => state.posts.detail[payload.name]);
      if (result.status === 201) {
        yield put({
          type: 'updateDetail',
          payload: {
            name: payload.name,
            values: [...tags , {_id: result.data._id, tag_name: result.data.tag_name}],
          },
        });
      }
    },
    * addPhoto ({ payload }, { select, call, put }) {
      const type = yield select(state => state.posts.insertPhotoType);
      const photoItem =  yield select(state => state.media.currentItem);
      yield put({
        type: 'updateDetail',
        payload: {
          name: type,
          values: photoItem
        }
      })
    }
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
    switchLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    updateDetail(state, { payload }) {
      return { ...state, detail: { ...state.detail, [payload.name]: payload.values }}
    },
    openPhotoPicker(state, { payload }) {
      return { ...state, showPhotoPicker: true, insertPhotoType: payload }
    },
    closePhotoPicker(state, { payload }) {
      return { ...state, showPhotoPicker: false}
    },
  },
};
