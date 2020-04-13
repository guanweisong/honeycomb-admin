import request from '@/utils/request'

export const index = (params) => {
  console.log('menus=>service=>index', params)
  return request({
    url: '/menus',
    method: 'get',
    params,
  })
}
export const update = (params) => {
  console.log('menus=>service=>update', params)
  return request({
    url: `/menus`,
    method: 'patch',
    data: params,
  })
}
