import request from '@/utils/request';

export const index = (params) => {
  console.log('pages=>service=>index', params);
  return request({
    url: '/pages',
    method: 'get',
    params: params,
  })
}
export const create = (params) => {
  console.log('pages=>service=>create', params);
  return request({
    url: '/pages',
    method: 'post',
    data: params,
  })
}
export const distory = (id) => {
  console.log('pages=>service=>distory', id);
  return request({
    url: `/pages/${id}`,
    method: 'delete',
  })
}
export const update = (id, params) => {
  console.log('pages=>service=>update', id, params);
  return request({
    url: `/pages/${id}`,
    method: 'patch',
    data: params,
  })
}
