import request from '@/utils/request';
import type { CommentIndexRequest } from '@/pages/comment/types/comment.index.request';
import type { CommentIndexResponse } from '@/pages/comment/types/comment.index.response';
import type { CommentEntity } from '@/pages/comment/types/comment.entity';
import type { CommentCreateResponse } from '@/pages/comment/types/comment.create.response';
import type { BaseResponse } from '@/types/BaseResponse';

export const index = (params?: CommentIndexRequest): Promise<CommentIndexResponse> => {
  console.log('comments=>service=>index', params);
  return request({
    url: '/comment',
    method: 'get',
    params,
  });
};

export const create = (params: Omit<CommentEntity, 'id'>): Promise<CommentCreateResponse> => {
  console.log('comments=>service=>create', params);
  return request({
    url: '/comment',
    method: 'post',
    data: params,
  });
};

export const destroy = (ids: string[]): Promise<BaseResponse<null>> => {
  console.log('comments=>service=>distory', ids);
  return request({
    url: `/comment`,
    method: 'delete',
    params: { ids },
  });
};

export const update = (
  id: string,
  params: Partial<Omit<CommentEntity, 'id'>>,
): Promise<CommentCreateResponse> => {
  console.log('comments=>service=>update', id, params);
  return request({
    url: `/comment/${id}`,
    method: 'patch',
    data: params,
  });
};
