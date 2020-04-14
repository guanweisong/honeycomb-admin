import request from '@/utils/request'

export const indexPageList = (params) => {
  console.log('pages=>service=>indexPageList', params)
  return request({
    url: '/pages/list',
    method: 'get',
    params,
  })
}

export const indexPageDetail = (params) => {
  console.log('pages=>service=>indexPageDetail')
  return request({
    url: `/pages/detail/${params._id}`,
    method: 'get',
  })
}

export const create = (params) => {
  console.log('pages=>service=>create', params)
  return request({
    url: '/pages/detail',
    method: 'post',
    data: params,
  })
}

export const distory = (id) => {
  console.log('pages=>service=>distory', id)
  return request({
    url: `/pages/detail/${id}`,
    method: 'delete',
  })
}

export const update = (id, params) => {
  console.log('pages=>service=>update', id, params)
  return request({
    url: `/pages/detail/${id}`,
    method: 'patch',
    data: params,
  })
}
