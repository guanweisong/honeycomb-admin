import request from '@/utils/request';

export const verify = () => {
  console.log('app=>service=>verify');
  return request({
    url: '/access/verify',
    method: 'post',
  });
};

export const logout = (id) => {
  console.log('app=>service=>logout');
  return request({
    url: '/access/logout',
    method: 'post',
    data: {
      id,
    },
  });
};

export const setSettingInfo = () => {
  console.log('app=>service=>setSettingInfo');
  return request({
    url: '/settings',
    method: 'get',
  })
}
