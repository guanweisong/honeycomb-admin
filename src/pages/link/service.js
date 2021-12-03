import request from '@/utils/request'

export const index = (params) => {
  console.log('links=>service=>index', params)
  return request({
    url: '/links',
    method: 'get',
    params,
  })
}

export const create = (params) => {
  console.log('links=>service=>create', params)
  return request({
    url: '/links',
    method: 'post',
    data: params,
  })
}

export const distory = (ids) => {
  console.log('links=>service=>distory', ids)
  return request({
    url: `/links`,
    params: {ids},
    method: 'delete',
  })
}

export const update = (id, params) => {
  console.log('links=>service=>update', id, params)
  return request({
    url: `/links/${id}`,
    method: 'patch',
    data: params,
  })
}
