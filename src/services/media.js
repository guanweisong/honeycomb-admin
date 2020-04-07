import request from '@/utils/request'

export const index = (params) => {
  console.log('media=>service=>index', params)
  return request({
    url: '/media',
    method: 'get',
    params,
  })
}
export const create = (params) => {
  console.log('media=>service=>create', params)
  return request({
    url: '/media',
    method: 'post',
    data: params,
  })
}
export const distory = (id) => {
  console.log('media=>service=>distory', id)
  return request({
    url: `/media/${id}`,
    method: 'delete',
  })
}
export const update = (id, params) => {
  console.log('media=>service=>update', id, params)
  return request({
    url: `/media/${id}`,
    method: 'patch',
    data: params,
  })
}
