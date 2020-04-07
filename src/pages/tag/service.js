import request from '@/utils/request'

export const index = (params) => {
  console.log('tags=>service=>index', params)
  return request({
    url: '/tags',
    method: 'get',
    params,
  })
}
export const create = (params) => {
  console.log('tags=>service=>create', params)
  return request({
    url: '/tags',
    method: 'post',
    data: params,
  })
}
export const distory = (id) => {
  console.log('tags=>service=>distory', id)
  return request({
    url: `/tags/${id}`,
    method: 'delete',
  })
}
export const update = (id, params) => {
  console.log('tags=>service=>update', id, params)
  return request({
    url: `/tags/${id}`,
    method: 'patch',
    data: params,
  })
}
