import request from '@/utils/request';
import type { PostIndexRequest } from '@/pages/post/types/post.index.request';
import type { PostIndexResponse } from '@/pages/post/types/post.index.response';
import type { BaseResponse } from '@/types/BaseResponse';
import type { PostEntity } from '@/pages/post/types/post.entity';
import type { PostCreateResponse } from '@/pages/post/types/post.create.response';

export const indexPostList = (params?: PostIndexRequest): Promise<PostIndexResponse> => {
  console.log('posts=>service=>indexPostList', params);
  return request({
    url: '/posts',
    method: 'get',
    params,
  });
};

export const indexPostDetail = (params: Partial<PostEntity>): Promise<PostCreateResponse> => {
  console.log('post=>service=>indexPostDetail');
  return request({
    url: `/posts/${params._id}`,
    method: 'get',
  });
};

export const create = (params: Omit<PostEntity, '_id'>): Promise<PostCreateResponse> => {
  console.log('posts=>service=>create', params);
  return request({
    url: '/posts',
    method: 'post',
    data: params,
  });
};

export const destroy = (ids: string[]): Promise<BaseResponse<null>> => {
  console.log('posts=>service=>destroy', ids);
  return request({
    url: `/posts`,
    params: { ids },
    method: 'delete',
  });
};

export const update = (
  id: string,
  params: Partial<Omit<PostEntity, '_id'>>,
): Promise<PostCreateResponse> => {
  console.log('posts=>service=>update', id, params);
  return request({
    url: `/posts/${id}`,
    method: 'patch',
    data: params,
  });
};
