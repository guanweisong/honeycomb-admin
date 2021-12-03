import request from '@/utils/request'

export const index = (params) => {
  console.log('categories=>service=>index', params)
  return request({
    url: '/categories',
    method: 'get',
    params: {
      limit: 999,
      ...params,
    },
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
export const distory = (ids) => {
  console.log('categories=>service=>distory', ids)
  return request({
    url: `/categories`,
    params: {ids},
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
