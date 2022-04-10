import request from '@/utils/request';
import type { LoginRequest } from '@/pages/login/types/login.request';
import type { LoginResponse } from '@/pages/login/types/login.response';

export const login = (params: LoginRequest): Promise<LoginResponse> => {
  return request({
    url: '/auth/login',
    method: 'post',
    data: params,
  });
};

export const logout = () => {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
};
