import { message } from 'antd';
import { createModel } from 'hox';
import { useState } from 'react';
import * as tagsService from './service';
import type { TagIndexRequest } from '@/pages/tag/types/tag.index.request';
import type { TagEntity } from '@/pages/tag/types/tag.entity';

function UseTag() {
  const [list, setList] = useState<TagEntity[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentItem, setCurrentItem] = useState<TagEntity>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState(0); // 0:增加,1:修改
  const [loading, setLoading] = useState<boolean>(false);

  const index = async (values?: TagIndexRequest) => {
    console.log('tags=>model=>index', values);
    setLoading(true);
    const result = await tagsService.index(values);
    if (result.status === 200) {
      setList(result.data.list);
      setTotal(result.data.total);
    }
    setLoading(false);
  };

  const destroy = async (ids: string[]) => {
    console.log('tags=>model=>distory', ids);
    const result = await tagsService.destroy(ids);
    if (result.status === 204) {
      index();
      message.success('删除成功');
    }
  };

  const update = async (id: string, values: Partial<Omit<TagEntity, '_id'>>) => {
    console.log('tags=>model=>update', id, values);
    const result = await tagsService.update(id, values);
    if (result.status === 201) {
      index();
      message.success('更新成功');
    }
  };

  const create = async (values: Omit<TagEntity, '_id'>) => {
    console.log('tags=>model=>create', values);
    const result = await tagsService.create(values);
    if (result.status === 201) {
      index();
      message.success('添加成功');
    }
  };

  const checkExist = async ({ tag_name }: { tag_name: string }) => {
    console.log('tags=>model=>checkExist', tag_name);
    let exist = false;
    const result = await tagsService.index({ tag_name });
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

export default createModel(UseTag);
