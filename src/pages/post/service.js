import request from '@/utils/request';

export const index = (params) => {
  console.log('posts=>service=>index', params);
  return request({
    url: '/posts',
    method: 'get',
    params: params,
  })
}
export const create = (params) => {
  console.log('posts=>service=>create', params);
  return request({
    url: '/posts',
    method: 'post',
    data: params,
  })
}
export const distory = (id) => {
  console.log('posts=>service=>distory', id);
  return request({
    url: `/posts/${id}`,
    method: 'delete',
  })
}
export const update = (id, params) => {
  console.log('posts=>service=>update', id, params);
  return request({
    url: `/posts/${id}`,
    method: 'patch',
    data: params,
  })
}
