import { UserEntity } from '@/app/(root)/(dashboard)/user/types/user.entity';
import { BaseResponse } from '@/types/BaseResponse';
import request from '@/utils/request';

export const queryUser = (): Promise<BaseResponse<UserEntity>> => {
  return request({
    url: '/auth/queryUser',
    method: 'get',
  });
};
