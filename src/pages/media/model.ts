import { message } from 'antd';
import * as mediaService from './service';
import { createModel } from 'hox';
import { useState } from 'react';
import type { MediaIndexRequest } from '@/pages/media/types/media.index.request';
import type { MediaEntity } from '@/pages/media/types/media.entity';
import { TabType } from '@/pages/media/types/TabType';

function UseMedia() {
  const [list, setList] = useState<MediaEntity[]>();
  const [total, setTotal] = useState(0);
  const [currentItem, setCurrentItem] = useState<MediaEntity>();
  const [tab, setTab] = useState<TabType>(TabType.ALL);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const index = async (values?: MediaIndexRequest) => {
    console.log('media=>model=>index', values);
    const result = await mediaService.index(values);
    if (result.status === 200) {
      setList(result.data.list);
      setTotal(result.data.total);
    }
  };

  const destroy = async (ids: string[]) => {
    console.log('media=>model=>distory', ids);
    const result = await mediaService.destroy(ids);
    if (result.status === 204) {
      index();
      setCurrentItem(undefined);
      message.success('删除成功');
    }
  };

  const update = async (id: string, values: Partial<Omit<MediaEntity, '_id'>>) => {
    console.log('media=>model=>update', id, values);
    const result = await mediaService.update(id, values);
    if (result.status === 201) {
      index();
      message.success('更新成功');
    }
  };

  const create = async (values: Omit<MediaEntity, '_id'>) => {
    console.log('media=>model=>create', values);
    const result = await mediaService.create(values);
    if (result.status === 201) {
      index();
      message.success('添加成功');
    }
  };

  return {
    list,
    total,
    currentItem,
    setCurrentItem,
    tab,
    setTab,
    showModal,
    setShowModal,
    loading,
    setLoading,
    index,
    destroy,
    update,
    create,
  };
}

export default createModel(UseMedia);
