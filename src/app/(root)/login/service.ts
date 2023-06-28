import request from '@/utils/request';
import type { LoginRequest } from './types/login.request';
import type { LoginResponse } from './types/login.response';

export default class LoginService {
  static login = (params: LoginRequest): Promise<LoginResponse> => {
    return request({
      url: '/auth/login',
      method: 'post',
      data: params,
    });
  };

  static logout = () => {
    return request({
      url: '/auth/logout',
      method: 'post',
    });
  };
}
