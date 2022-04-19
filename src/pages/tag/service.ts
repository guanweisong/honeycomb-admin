import request from '@/utils/request';
import type { TagIndexRequest } from '@/pages/tag/types/tag.index.request';
import type { TagIndexResponse } from '@/pages/tag/types/tag.index.response';
import type { TagEntity } from '@/pages/tag/types/tag.entity';
import type { TagCreateResponse } from '@/pages/tag/types/tag.create.response';
import type { BaseResponse } from '@/types/BaseResponse';

export const index = (params?: TagIndexRequest): Promise<TagIndexResponse> => {
  console.log('tags=>service=>index', params);
  return request({
    url: '/tags',
    method: 'get',
    params,
  });
};

export const create = (
  params: Omit<TagEntity, '_id' | 'created_at' | 'updated_at'>,
): Promise<TagCreateResponse> => {
  console.log('tags=>service=>create', params);
  return request({
    url: '/tags',
    method: 'post',
    data: params,
  });
};

export const destroy = (ids: string[]): Promise<BaseResponse<null>> => {
  console.log('tags=>service=>destroy', ids);
  return request({
    url: `/tags`,
    params: { ids },
    method: 'delete',
  });
};

export const update = (
  id: string,
  params: Partial<Omit<TagEntity, '_id'>>,
): Promise<TagCreateResponse> => {
  console.log('tags=>service=>update', id, params);
  return request({
    url: `/tags/${id}`,
    method: 'patch',
    data: params,
  });
};
