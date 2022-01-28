import request from '@/utils/request';
import type { CategoryIndexRequest } from '@/pages/post/category/types/category.index.request';
import type { CategoryIndexResponse } from '@/pages/post/category/types/category.index.response';
import type { CategoryEntity } from '@/pages/post/category/types/category.entity';
import type { CategoryCreateResponse } from '@/pages/post/category/types/category.create.response';
import type { BaseResponse } from '@/types/BaseResponse';

export const index = (params?: CategoryIndexRequest): Promise<CategoryIndexResponse> => {
  console.log('categories=>service=>index', params);
  return request({
    url: '/categories',
    method: 'get',
    params: {
      limit: 999,
      ...params,
    },
  });
};

export const create = (params: Omit<CategoryEntity, '_id'>): Promise<CategoryCreateResponse> => {
  console.log('categories=>service=>create', params);
  return request({
    url: '/categories',
    method: 'post',
    data: params,
  });
};

export const destroy = (ids: string[]): Promise<BaseResponse<null>> => {
  console.log('categories=>service=>destroy', ids);
  return request({
    url: `/categories`,
    params: { ids },
    method: 'delete',
  });
};

export const update = (
  id: string,
  params: Partial<Omit<CategoryEntity, '_id'>>,
): Promise<CategoryCreateResponse> => {
  console.log('categories=>service=>update', id, params);
  return request({
    url: `/categories/${id}`,
    method: 'patch',
    data: params,
  });
};
