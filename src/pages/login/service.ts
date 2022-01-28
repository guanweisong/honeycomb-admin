import request from '@/utils/request';
import type { LoginRequest } from '@/pages/login/types/LoginRequest';
import type { LoginResponse } from '@/pages/login/types/LoginResponse';

export const login = (params: LoginRequest): Promise<LoginResponse> => {
  console.log('login=>service=>index', params);
  return request({
    url: '/auth/login',
    method: 'post',
    data: params,
  });
};
