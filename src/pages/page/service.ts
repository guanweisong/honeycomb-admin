import request from '@/utils/request';
import type { PageIndexListRequest } from '@/pages/page/types/page.index.list.request';
import type { PageIndexListResponse } from '@/pages/page/types/page.index.list.response';
import type { PageEntity } from '@/pages/page/types/page.entity';
import type { PageCreateResponse } from '@/pages/page/types/page.create.response';
import type { BaseResponse } from '@/types/BaseResponse';

export const indexPageList = (params?: PageIndexListRequest): Promise<PageIndexListResponse> => {
  console.log('page=>service=>indexPageList', params);
  return request({
    url: '/page',
    method: 'get',
    params,
  });
};

export const indexPageDetail = (params: Partial<PageEntity>): Promise<PageCreateResponse> => {
  console.log('page=>service=>indexPageDetail');
  return request({
    url: `/page/${params.id}`,
    method: 'get',
  });
};

export const create = (params: Omit<PageEntity, 'id'>): Promise<PageCreateResponse> => {
  console.log('page=>service=>create', params);
  return request({
    url: '/page',
    method: 'post',
    data: params,
  });
};

export const destroy = (ids: string[]): Promise<BaseResponse<null>> => {
  console.log('page=>service=>destroy', ids);
  return request({
    url: `/page`,
    params: { ids },
    method: 'delete',
  });
};

export const update = (
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
