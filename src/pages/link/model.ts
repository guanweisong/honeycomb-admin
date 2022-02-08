import { message } from 'antd';
import { createModel } from 'hox';
import { useState } from 'react';
import * as linksService from './service';
import type { LinkEntity } from '@/pages/link/types/link.entity';
import type { LinkIndexRequest } from '@/pages/link/types/link.index.request';
import { ModalType } from '@/types/ModalType';

function useLink() {
  const [list, setList] = useState<LinkEntity[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentItem, setCurrentItem] = useState<LinkEntity>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.ADD);
  const [loading, setLoading] = useState<boolean>(false);

  const index = async (values?: LinkIndexRequest) => {
    console.log('links=>model=>index', values);
    setLoading(true);
    const result = await linksService.index(values);
    if (result.status === 200) {
      setList(result.data.list);
      setTotal(result.data.total);
    }
    setLoading(false);
  };

  const destroy = async (ids: string[]) => {
    console.log('links=>model=>distory', ids);
    const result = await linksService.distory(ids);
    if (result.status === 204) {
      index();
      message.success('删除成功');
    }
  };

  const update = async (id: string, values: Partial<Omit<LinkEntity, '_id'>>) => {
    console.log('links=>model=>update', id, values);
    const result = await linksService.update(id, values);
    if (result.status === 201) {
      index();
      message.success('更新成功');
    }
  };

  const create = async (values: Omit<LinkEntity, '_id'>) => {
    console.log('links=>model=>create', values);
    const result = await linksService.create(values);
    if (result.status === 201) {
      index();
      message.success('添加成功');
    }
  };

  const checkExist = async ({ link_url }: { link_url: string }) => {
    console.log('links=>model=>checkExist', link_url);
    let exist = false;
    const result = await linksService.index({ link_url });
    const currentId = currentItem?._id;
    if (result.data.total > 0 && result.data.list[0]._id !== currentId) {
      exist = true;
    }
    return exist;
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
    destroy,
    update,
    create,
    checkExist,
  };
}

export default createModel(useLink);
