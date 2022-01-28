import { message } from 'antd';
import { createModel } from 'hox';
import { useState } from 'react';
import * as commentsService from './service';
import type { CommentIndexRequest } from '@/pages/comment/types/comment.index.request';
import type { CommentEntity } from '@/pages/comment/types/comment.entity';

function UseComment() {
  const [list, setList] = useState<CommentEntity[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const index = async (values?: CommentIndexRequest) => {
    console.log('comments=>model=>index', values);
    setLoading(true);
    const result = await commentsService.index(values);
    if (result.status === 200) {
      setList(result.data.list);
      setTotal(result.data.total);
    }
    setLoading(false);
  };

  const update = async (id: string, values: Partial<Omit<CommentEntity, '_id'>>) => {
    console.log('comments=>model=>update', id, values);
    const result = await commentsService.update(id, values);
    if (result.status === 201) {
      index();
      message.success('更新成功');
    }
  };

  const destroy = async (ids: string[]) => {
    console.log('comments=>model=>distory', ids);
    const result = await commentsService.destroy(ids);
    if (result.status === 204) {
      index();
      message.success('删除成功');
    }
  };

  return {
    list,
    total,
    loading,
    index,
    update,
    destroy,
  };
}

export default createModel(UseComment);
