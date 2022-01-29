import { message } from 'antd';
import { createModel } from 'hox';
import { useState } from 'react';
import { history } from 'umi';
import moment from 'moment';
import useMediaModel from '@/pages/media/model';
import * as postsService from './service';
import * as tagsService from '../tag/service';
import type { CategoryReadOnly, PostEntity } from '@/pages/post/types/post.entity';
import type { PostIndexRequest } from '@/pages/post/types/post.index.request';
import type { TagEntity } from '@/pages/tag/types/tag.entity';
import { ModalType } from '@/types/ModalType';

const showdown = require('showdown');

const converter = new showdown.Converter();

function UsePost() {
  const mediaModel = useMediaModel();

  const [list, setList] = useState<PostEntity[]>();
  const [total, setTotal] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.ADD);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState<'post_cover'>();
  const [detail, setDetail] = useState<PostEntity>();

  const index = async (values?: PostIndexRequest) => {
    console.log('post=>model=>index', values);
    setLoading(true);
    const result = await postsService.indexPostList(values);
    if (result.status === 200) {
      setList(result.data.list);
      setTotal(result.data.total);
    }
    setLoading(false);
  };

  const indexDetail = async (values: Partial<PostEntity>) => {
    console.log('post=>model=>detail', values);
    let result;
    if (typeof values._id !== 'undefined') {
      result = await postsService.indexPostDetail(values);
      result = result.data;
      if (result.movie_time) {
        result.movie_time = moment(result.movie_time);
      }
      if (result.gallery_time) {
        result.gallery_time = moment(result.movie_time);
      }
      if (result.post_content) {
        result.post_content = converter.makeMd(result.post_content);
      }
      const post_category = result.post_category as CategoryReadOnly;
      if (post_category) {
        result.post_category = post_category._id as string;
      }
      setDetail(result);
    }
  };

  const destroy = async (ids: string[]) => {
    console.log('post=>model=>distory', ids);
    const result = await postsService.destroy(ids);
    if (result.status === 204) {
      index();
      message.success('删除成功');
    }
  };

  const update = async (id: string, values: Omit<PostEntity, '_id'>) => {
    console.log('post=>model=>update', id, values);
    const result = await postsService.update(id, values);
    if (result.status === 201) {
      message.success('更新成功');
      indexDetail({ _id: id });
    }
  };

  const create = async (values: Omit<PostEntity, '_id'>) => {
    console.log('post=>model=>create', values);
    const result = await postsService.create(values);
    if (result.status === 201) {
      message.success('添加成功');
      history.push({
        pathname: '/post/edit',
        query: {
          _id: result.data._id,
        },
      });
    }
  };

  const createTag = async (
    name: 'movie_actor' | 'movie_director' | 'movie_style' | 'gallery_style',
    tag_name: string,
  ) => {
    console.log('posts=>model=>createTag', name, tag_name);
    const result = await tagsService.create({ tag_name });
    if (result && result.status === 201) {
      setDetail({
        ...detail,
        [name]: [...detail[name], { _id: result.data._id, tag_name: result.data.tag_name }],
      });
    }
  };

  const updateTag = (
    name: 'movie_actor' | 'movie_director' | 'movie_style' | 'gallery_style',
    tags: TagEntity[],
  ) => {
    setDetail({
      ...detail,
      [name]: tags,
    });
  };

  const addPhoto = () => {
    setDetail({ ...detail, [showPhotoPicker]: mediaModel.currentItem });
  };

  return {
    list,
    total,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    loading,
    showPhotoPicker,
    setShowPhotoPicker,
    detail,
    setDetail,
    index,
    indexDetail,
    destroy,
    update,
    create,
    createTag,
    updateTag,
    addPhoto,
  };
}

export default createModel(UsePost);
