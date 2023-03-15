import request from '@/utils/request';
import type { CategoryIndexRequest } from '@/pages/post/category/types/category.index.request';
import type { CategoryIndexResponse } from '@/pages/post/category/types/category.index.response';
import type { CategoryEntity } from '@/pages/post/category/types/category.entity';
import type { CategoryCreateResponse } from '@/pages/post/category/types/category.create.response';
import type { BaseResponse } from '@/types/BaseResponse';

export const index = (params?: CategoryIndexRequest): Promise<CategoryIndexResponse> => {
  console.log('category=>service=>index', params);
  return request({
    url: '/category',
    method: 'get',
    params: {
      limit: 999,
      ...params,
    },
  });
};

export const create = (params: Omit<CategoryEntity, 'id'>): Promise<CategoryCreateResponse> => {
  console.log('category=>service=>create', params);
  return request({
    url: '/category',
    method: 'post',
    data: params,
  });
};

export const destroy = (ids: string[]): Promise<BaseResponse<null>> => {
  console.log('category=>service=>destroy', ids);
  return request({
    url: `/category`,
    params: { ids },
    method: 'delete',
  });
};

export const update = (
  id: string,
  params: Partial<Omit<CategoryEntity, 'id'>>,
): Promise<CategoryCreateResponse> => {
  console.log('category=>service=>update', id, params);
  return request({
    url: `/category/${id}`,
    method: 'patch',
    data: params,
  });
};
