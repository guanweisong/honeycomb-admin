import request from '@/utils/request';

export const index = (params) => {
  console.log('links=>service=>index', params);
  return request({
    url: '/links',
    method: 'get',
    params: params,
  })
}
export const create = (params) => {
  console.log('links=>service=>create', params);
  return request({
    url: '/links',
    method: 'post',
    data: params,
  })
}
export const distory = (id) => {
  console.log('links=>service=>distory', id);
  return request({
    url: `/links/${id}`,
    method: 'delete',
  })
}
export const update = (id, params) => {
  console.log('links=>service=>update', id, params);
  return request({
    url: `/links/${id}`,
    method: 'patch',
    data: params,
  })
}
