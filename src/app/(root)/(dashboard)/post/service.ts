import type { BaseResponse } from '@/types/BaseResponse';
import request from '@/utils/request';
import type { PostCreateResponse } from './types/post.create.response';
import type { PostEntity } from './types/post.entity';
import type { PostIndexRequest } from './types/post.index.request';
import type { PostIndexResponse } from './types/post.index.response';

export const indexPostList = (params?: PostIndexRequest): Promise<PostIndexResponse> => {
  console.log('post=>service=>indexPostList', params);
  return request({
    url: '/post',
    method: 'get',
    params,
  });
};

export const indexPostDetail = (params: Partial<PostEntity>): Promise<PostCreateResponse> => {
  console.log('post=>service=>indexPostDetail');
  return request({
    url: `/post/${params.id}`,
    method: 'get',
  });
};

export const create = (params: Omit<PostEntity, 'id'>): Promise<PostCreateResponse> => {
  console.log('post=>service=>create', params);
  return request({
    url: '/post',
    method: 'post',
    data: params,
  });
};

export const destroy = (ids: string[]): Promise<BaseResponse<null>> => {
  console.log('post=>service=>destroy', ids);
  return request({
    url: `/post`,
    params: { ids },
    method: 'delete',
  });
};

export const update = (
  id: string,
  params: Partial<Omit<PostEntity, 'id'>>,
): Promise<PostCreateResponse> => {
  console.log('post=>service=>update', id, params);
  return request({
    url: `/post/${id}`,
    method: 'patch',
    data: params,
  });
};
