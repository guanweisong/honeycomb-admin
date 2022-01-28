import request from '@/utils/request';

export const verify = () => {
  console.log('app=>service=>verify');
  return request({
    url: '/auth/verify',
    method: 'post',
  });
};

export const logout = () => {
  console.log('app=>service=>logout');
  return request({
    url: '/auth/logout',
    method: 'post',
  });
};
