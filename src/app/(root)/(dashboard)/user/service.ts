import request from '@/utils/request';

import type { BaseResponse } from '@/types/BaseResponse';
import type { UserCreateResponse } from './types/user.create.response';
import type { UserEntity } from './types/user.entity';
import type { UserIndexRequest } from './types/user.index.request';
import type { UserIndexResponse } from './types/user.index.response';

export default class UserService {
  static index = (params?: UserIndexRequest): Promise<UserIndexResponse> => {
    console.log('user=>service=>index', params);
    return request({
      url: '/user',
      method: 'get',
      params,
    });
  };

  static create = (params: Omit<UserEntity, 'id'>): Promise<UserCreateResponse> => {
    console.log('user=>service=>create', params);
    return request({
      url: '/user',
      method: 'post',
      data: params,
    });
  };

  static destroy = (ids: string[]): Promise<BaseResponse<null>> => {
    console.log('user=>service=>distory', ids);
    return request({
      url: `/user`,
      method: 'delete',
      params: { ids },
    });
  };

  static update = (
    id: string,
    params: Partial<Omit<UserEntity, 'id'>>,
  ): Promise<UserCreateResponse> => {
    console.log('user=>service=>update', id, params);
    return request({
      url: `/user/${id}`,
      method: 'patch',
      data: params,
    });
  };
}
