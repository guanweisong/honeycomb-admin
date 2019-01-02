import request from '@/utils/request';

export const update = (params) => {
  console.log('settings=>service=>update', params);
  return request({
    url: `/settings`,
    method: 'put',
    data: params,
  })
}
