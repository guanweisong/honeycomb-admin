import { message } from 'antd';
import { createModel } from 'hox';
import { useState } from 'react';
import * as usersService from './service';
import type { UserEntity } from '@/pages/user/types/user.entity';
import type { UserIndexRequest } from '@/pages/user/types/user.index.request';

function UseUser() {
  const [list, setList] = useState<UserEntity[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentItem, setCurrentItem] = useState<UserEntity>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<0 | 1>(0); // 0:增加,1:修改
  const [loading, setLoading] = useState<boolean>(false);

  const index = async (values?: UserIndexRequest) => {
    console.log('users=>model=>index', values);
    setLoading(true);
    const result = await usersService.index(values);
    if (result.status === 200) {
      setList(result.data.list);
      setTotal(result.data.total);
    }
    setLoading(false);
  };

  const destroy = async (ids: string[]) => {
    console.log('users=>model=>distory', ids);
    const result = await usersService.destroy(ids);
    if (result.status === 204) {
      index();
      message.success('删除成功');
    }
  };

  const update = async (id: string, values: Partial<Omit<UserEntity, '_id'>>) => {
    console.log('users=>model=>update', id, values);
    const result = await usersService.update(id, values);
    if (result.status === 201) {
      index();
      message.success('更新成功');
    }
  };

  const create = async (values: Omit<UserEntity, '_id'>) => {
    console.log('users=>model=>create', values);
    const result = await usersService.create(values);
    if (result.status === 201) {
      index();
      message.success('添加成功');
    }
  };

  const checkExist = async ({
    user_name,
    user_email,
  }: {
    user_name?: string;
    user_email?: string;
  }) => {
    console.log('users=>model=>checkExist', { user_name });
    let exist = false;
    const result = await usersService.index({ user_name, user_email });
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

export default createModel(UseUser);
