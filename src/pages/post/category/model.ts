import { message } from 'antd';
import * as categoryService from '@/pages/post/category/service';
import { createModel } from 'hox';
import { useState } from 'react';
import type { CategoryEntity } from '@/pages/post/category/types/category.entity';
import type { CategoryIndexRequest } from '@/pages/post/category/types/category.index.request';
import { ModalType } from '@/types/ModalType';

function UseCategory() {
  const [list, setList] = useState<CategoryEntity[]>([]);
  const [currentItem, setCurrentItem] = useState<CategoryEntity>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.ADD);

  const index = async (values?: CategoryIndexRequest) => {
    console.log('category=>model=>index', values);
    const result = await categoryService.index(values);
    if (result.status === 200) {
      setList(result.data.list);
    }
  };

  const destroy = async (ids: string[]) => {
    console.log('category=>model=>distory', ids);
    const result = await categoryService.destroy(ids);
    if (result.status === 204) {
      index();
      message.success('删除成功');
    }
  };

  const update = async (id: string, values: Partial<Omit<CategoryEntity, '_id'>>) => {
    console.log('category=>model=>update', id, values);
    const result = await categoryService.update(id, values);
    if (result.status === 201) {
      index();
      message.success('更新成功');
    }
  };

  const create = async (values: Omit<CategoryEntity, '_id'>) => {
    console.log('category=>model=>create', values);
    const result = await categoryService.create(values);
    if (result.status === 201) {
      index();
      message.success('添加成功');
    }
  };

  const checkExist = async (values: CategoryIndexRequest) => {
    console.log('category=>model=>checkExist', values);
    let exist = false;
    const result = await categoryService.index(values);
    if (result.data.total > 0 && result.data.list[0]._id !== currentItem?._id) {
      exist = true;
    }
    return exist;
  };

  return {
    list,
    currentItem,
    setCurrentItem,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    index,
    destroy,
    update,
    create,
    checkExist,
  };
}

export default createModel(UseCategory);
