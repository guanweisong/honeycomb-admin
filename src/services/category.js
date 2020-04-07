import request from '@/utils/request'

export const index = (params) => {
  console.log('categories=>service=>index', params)
  return request({
    url: '/categories',
    method: 'get',
    params,
  })
}
export const create = (params) => {
  console.log('categories=>service=>create', params)
  return request({
    url: '/categories',
    method: 'post',
    data: params,
  })
}
export const distory = (id) => {
  console.log('categories=>service=>distory', id)
  return request({
    url: `/categories/${id}`,
    method: 'delete',
  })
}
export const update = (id, params) => {
  console.log('categories=>service=>update', id, params)
  return request({
    url: `/categories/${id}`,
    method: 'patch',
    data: params,
  })
}
