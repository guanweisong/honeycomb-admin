import type { BaseResponse } from '@/types/BaseResponse';
import request from '@/utils/request';
import type { PageCreateResponse } from './types/page.create.response';
import type { PageEntity } from './types/page.entity';
import type { PageIndexListRequest } from './types/page.index.list.request';
import type { PageIndexListResponse } from './types/page.index.list.response';

export default class PageService {
  static indexPageList = (params?: PageIndexListRequest): Promise<PageIndexListResponse> => {
    console.log('page=>service=>indexPageList', params);
    return request({
      url: '/page',
      method: 'get',
      params,
    });
  };

  static indexPageDetail = (params: Partial<PageEntity>): Promise<PageCreateResponse> => {
    console.log('page=>service=>indexPageDetail');
    return request({
      url: `/page/${params.id}`,
      method: 'get',
    });
  };

  static create = (params: Omit<PageEntity, 'id'>): Promise<PageCreateResponse> => {
    console.log('page=>service=>create', params);
    return request({
      url: '/page',
      method: 'post',
      data: params,
    });
  };

  static destroy = (ids: string[]): Promise<BaseResponse<null>> => {
    console.log('page=>service=>destroy', ids);
    return request({
      url: `/page`,
      params: { ids },
      method: 'delete',
    });
  };

  static update = (
    id: string,
    params: Partial<Omit<PageEntity, 'id'>>,
  ): Promise<PageCreateResponse> => {
    console.log('page=>service=>update', id, params);
    return request({
      url: `/page/${id}`,
      method: 'patch',
      data: params,
    });
  };
}
