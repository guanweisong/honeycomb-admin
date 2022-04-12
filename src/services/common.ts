import request from '@/utils/request';
import { UserEntity } from '@/pages/user/types/user.entity';
import { BaseResponse } from '@/types/BaseResponse';

export const queryUser = (): Promise<BaseResponse<UserEntity>> => {
  return request({
    url: '/auth/queryUser',
    method: 'get',
  });
};
