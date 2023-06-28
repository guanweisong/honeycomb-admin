import type { BaseResponse } from '@/types/BaseResponse';
import request from '@/utils/request';
import type { CategoryCreateResponse } from './types/category.create.response';
import type { CategoryEntity } from './types/category.entity';
import type { CategoryIndexRequest } from './types/category.index.request';
import type { CategoryIndexResponse } from './types/category.index.response';

export default class CategoryService {
  static index = (params?: CategoryIndexRequest): Promise<CategoryIndexResponse> => {
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

  static create = (params: Omit<CategoryEntity, 'id'>): Promise<CategoryCreateResponse> => {
    console.log('category=>service=>create', params);
    return request({
      url: '/category',
      method: 'post',
      data: params,
    });
  };

  static destroy = (ids: string[]): Promise<BaseResponse<null>> => {
    console.log('category=>service=>destroy', ids);
    return request({
      url: `/category`,
      params: { ids },
      method: 'delete',
    });
  };

  static update = (
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
}
