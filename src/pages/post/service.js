import request from '@/utils/request'

export const indexPostList = (params) => {
  console.log('posts=>service=>indexPostList', params)
  return request({
    url: '/posts/list',
    method: 'get',
    params,
  })
}
export const indexPostDetail = (params) => {
  console.log('post=>service=>indexPostDetail')
  return request({
    url: `/posts/detail/${params._id}`,
    method: 'get',
  })
}
export const create = (params) => {
  console.log('posts=>service=>create', params)
  return request({
    url: '/posts/detail',
    method: 'post',
    data: params,
  })
}
export const distory = (id) => {
  console.log('posts=>service=>distory', id)
  return request({
    url: `/posts/detail/${id}`,
    method: 'delete',
  })
}
export const update = (id, params) => {
  console.log('posts=>service=>update', id, params)
  return request({
    url: `/posts/detail/${id}`,
    method: 'patch',
    data: params,
  })
}
