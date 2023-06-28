import type { BaseResponse } from '@/types/BaseResponse';
import request from '@/utils/request';
import type { MediaCreateResponse } from './types/media.create.response';
import type { MediaEntity } from './types/media.entity';
import type { MediaIndexRequest } from './types/media.index.request';
import type { MediaIndexResponse } from './types/media.index.response';

export default class MediaService {
  static index = (params?: MediaIndexRequest): Promise<MediaIndexResponse> => {
    console.log('media=>service=>index', params);
    return request({
      url: '/media',
      method: 'get',
      params,
    });
  };

  static create = (params: Omit<MediaEntity, 'id'>): Promise<MediaCreateResponse> => {
    console.log('media=>service=>create', params);
    return request({
      url: '/media',
      method: 'post',
      data: params,
    });
  };

  static destroy = (ids: string[]): Promise<BaseResponse<null>> => {
    console.log('media=>service=>distory', ids);
    return request({
      url: `/media`,
      method: 'delete',
      params: { ids },
    });
  };

  static update = (
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
}
