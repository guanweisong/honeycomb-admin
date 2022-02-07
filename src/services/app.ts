import request from '@/utils/request';

export const queryUser = () => {
  console.log('app=>service=>queryUser');
  return request({
    url: '/auth/queryUser',
    method: 'get',
  });
};

export const logout = () => {
  console.log('app=>service=>logout');
  return request({
    url: '/auth/logout',
    method: 'post',
  });
};
