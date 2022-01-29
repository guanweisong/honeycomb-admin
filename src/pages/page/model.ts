import { message } from 'antd';
import { history } from 'umi';
import { createModel } from 'hox';
import { useState } from 'react';
import * as pagesService from './service';
import { ModalType } from '@/types/ModalType';
import type { PageIndexListRequest } from '@/pages/page/types/page.index.list.request';
import type { PageEntity } from '@/pages/page/types/page.entity';

const showdown = require('showdown');

const converter = new showdown.Converter();

function UsePage() {
  const [list, setList] = useState<PageEntity[]>();
  const [total, setTotal] = useState(0);
  const [currentItem, setCurrentItem] = useState<PageEntity>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.ADD);
  const [loading, setLoading] = useState<boolean>(false);

  const index = async (values?: PageIndexListRequest) => {
    console.log('pages=>model=>index', values);
    setLoading(true);
    const result = await pagesService.indexPageList(values);
    if (result.status === 200) {
      setList(result.data.list);
      setTotal(result.data.total);
    }
    setLoading(false);
  };

  const detail = async (values: Partial<PageEntity>) => {
    console.log('pages=>model=>detial', values);
    let result;
    if (typeof values._id !== 'undefined') {
      result = await pagesService.indexPageDetail(values);
      result = result.data;
      if (result.page_content) {
        result.page_content = converter.makeMd(result.page_content);
      }
    }
    setCurrentItem(result);
  };

  const destroy = async (ids: string[]) => {
    console.log('pages=>model=>distory', ids);
    const result = await pagesService.destroy(ids);
    if (result && result.status === 204) {
      index();
      message.success('删除成功');
    }
  };

  const update = async (id: string, values: Partial<Omit<PageEntity, '_id'>>) => {
    console.log('pages=>model=>update', id, values);
    const result = await pagesService.update(id, values);
    if (result && result.status === 201) {
      message.success('更新成功');
      detail({ _id: id });
    }
  };

  const create = async (values: Omit<PageEntity, '_id'>) => {
    console.log('pages=>model=>create', values);
    const result = await pagesService.create(values);
    if (result && result.status === 201) {
      message.success('添加成功');
      history.push({
        pathname: '/page/edit',
        query: {
          _id: result.data._id,
        },
      });
    }
  };

  return {
    list,
    total,
    currentItem,
    setCurrentItem,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    loading,
    index,
    detail,
    destroy,
    update,
    create,
  };
}

export default createModel(UsePage);
