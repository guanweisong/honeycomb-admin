import request from '@/utils/request'

export const indexPostList = (params) => {
  console.log('posts=>service=>indexPostList', params)
  return request({
    url: '/posts',
    method: 'get',
    params,
  })
}
export const indexPostDetail = (params) => {
  console.log('post=>service=>indexPostDetail')
  return request({
    url: `/posts/${params._id}`,
    method: 'get',
  })
}
export const create = (params) => {
  console.log('posts=>service=>create', params)
  return request({
    url: '/posts',
    method: 'post',
    data: params,
  })
}
export const distory = (ids) => {
  console.log('posts=>service=>distory', ids)
  return request({
    url: `/posts`,
    params: {ids},
    method: 'delete',
  })
}
export const update = (id, params) => {
  console.log('posts=>service=>update', id, params)
  return request({
    url: `/posts/${id}`,
    method: 'patch',
    data: params,
  })
}
