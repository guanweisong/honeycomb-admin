import request from '@/utils/request';

export const index = (params) => {
  console.log('comments=>service=>index', params);
  return request({
    url: '/comments',
    method: 'get',
    params: params,
  })
}
export const create = (params) => {
  console.log('comments=>service=>create', params);
  return request({
    url: '/comments',
    method: 'post',
    data: params,
  })
}
export const distory = (id) => {
  console.log('comments=>service=>distory', id);
  return request({
    url: `/comments/${id}`,
    method: 'delete',
  })
}
export const update = (id, params) => {
  console.log('comments=>service=>update', id, params);
  return request({
    url: `/comments/${id}`,
    method: 'patch',
    data: params,
  })
}
