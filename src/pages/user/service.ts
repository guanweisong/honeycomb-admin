import request from '@/utils/request';

import type { UserIndexRequest } from '@/pages/user/types/user.index.request';
import type { UserEntity } from '@/pages/user/types/user.entity';
import type { UserIndexResponse } from '@/pages/user/types/user.index.response';
import type { UserCreateResponse } from '@/pages/user/types/user.create.response';
import type { BaseResponse } from '@/types/BaseResponse';

export const index = (params?: UserIndexRequest): Promise<UserIndexResponse> => {
  console.log('users=>service=>index', params);
  return request({
    url: '/users',
    method: 'get',
    params,
  });
};

export const create = (params: Omit<UserEntity, '_id'>): Promise<UserCreateResponse> => {
  console.log('users=>service=>create', params);
  return request({
    url: '/users',
    method: 'post',
    data: params,
  });
};

export const destroy = (ids: string[]): Promise<BaseResponse<null>> => {
  console.log('users=>service=>distory', ids);
  return request({
    url: `/users`,
    method: 'delete',
    params: { ids },
  });
};

export const update = (
  id: string,
  params: Partial<Omit<UserEntity, '_id'>>,
): Promise<UserCreateResponse> => {
  console.log('users=>service=>update', id, params);
  return request({
    url: `/users/${id}`,
    method: 'patch',
    data: params,
  });
};
