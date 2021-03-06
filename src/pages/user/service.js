import request from '@/utils/request'

export const index = (params) => {
  console.log('users=>service=>index', params)
  return request({
    url: '/users',
    method: 'get',
    params,
  })
}

export const create = (params) => {
  console.log('users=>service=>create', params)
  return request({
    url: '/users',
    method: 'post',
    data: params,
  })
}

export const distory = (id) => {
  console.log('users=>service=>distory', id)
  return request({
    url: `/users/${id}`,
    method: 'delete',
  })
}

export const update = (id, params) => {
  console.log('users=>service=>update', id, params)
  return request({
    url: `/users/${id}`,
    method: 'patch',
    data: params,
  })
}
