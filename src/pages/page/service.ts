import request from '@/utils/request'

export const indexPageList = (params) => {
  console.log('pages=>service=>indexPageList', params)
  return request({
    url: '/pages',
    method: 'get',
    params,
  })
}

export const indexPageDetail = (params) => {
  console.log('pages=>service=>indexPageDetail')
  return request({
    url: `/pages/${params._id}`,
    method: 'get',
  })
}

export const create = (params) => {
  console.log('pages=>service=>create', params)
  return request({
    url: '/pages',
    method: 'post',
    data: params,
  })
}

export const distory = (ids) => {
  console.log('pages=>service=>distory', ids)
  return request({
    url: `/pages`,
    params: {ids},
    method: 'delete',
  })
}

export const update = (id, params) => {
  console.log('pages=>service=>update', id, params)
  return request({
    url: `/pages/${id}`,
    method: 'patch',
    data: params,
  })
}
