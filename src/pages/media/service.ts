import request from '@/utils/request';
import type { MediaIndexRequest } from '@/pages/media/types/media.index.request';
import type { MediaIndexResponse } from '@/pages/media/types/media.index.response';
import type { MediaEntity } from '@/pages/media/types/media.entity';
import type { MediaCreateResponse } from '@/pages/media/types/media.create.response';
import type { BaseResponse } from '@/types/BaseResponse';

export const index = (params?: MediaIndexRequest): Promise<MediaIndexResponse> => {
  console.log('media=>service=>index', params);
  return request({
    url: '/media',
    method: 'get',
    params,
  });
};

export const create = (params: Omit<MediaEntity, 'id'>): Promise<MediaCreateResponse> => {
  console.log('media=>service=>create', params);
  return request({
    url: '/media',
    method: 'post',
    data: params,
  });
};

export const destroy = (ids: string[]): Promise<BaseResponse<null>> => {
  console.log('media=>service=>distory', ids);
  return request({
    url: `/media`,
    method: 'delete',
    params: { ids },
  });
};

export const update = (
  id: string,
  params: Partial<Omit<MediaEntity, 'id'>>,
): Promise<MediaCreateResponse> => {
  console.log('media=>service=>update', id, params);
  return request({
    url: `/media/${id}`,
    method: 'patch',
    data: params,
  });
};
