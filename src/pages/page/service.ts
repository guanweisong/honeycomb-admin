import request from '@/utils/request';
import type { PageIndexListRequest } from '@/pages/page/types/page.index.list.request';
import type { PageIndexListResponse } from '@/pages/page/types/page.index.list.response';
import type { PageEntity } from '@/pages/page/types/page.entity';
import type { PageCreateResponse } from '@/pages/page/types/page.create.response';
import type { BaseResponse } from '@/types/BaseResponse';

export const indexPageList = (params?: PageIndexListRequest): Promise<PageIndexListResponse> => {
  console.log('pages=>service=>indexPageList', params);
  return request({
    url: '/pages',
    method: 'get',
    params,
  });
};

export const indexPageDetail = (params: Partial<PageEntity>): Promise<PageCreateResponse> => {
  console.log('pages=>service=>indexPageDetail');
  return request({
    url: `/pages/${params._id}`,
    method: 'get',
  });
};

export const create = (params: Omit<PageEntity, '_id'>): Promise<PageCreateResponse> => {
  console.log('pages=>service=>create', params);
  return request({
    url: '/pages',
    method: 'post',
    data: params,
  });
};

export const destroy = (ids: string[]): Promise<BaseResponse<null>> => {
  console.log('pages=>service=>destroy', ids);
  return request({
    url: `/pages`,
    params: { ids },
    method: 'delete',
  });
};

export const update = (
  id: string,
  params: Partial<Omit<PageEntity, '_id'>>,
): Promise<PageCreateResponse> => {
  console.log('pages=>service=>update', id, params);
  return request({
    url: `/pages/${id}`,
    method: 'patch',
    data: params,
  });
};
