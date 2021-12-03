import request from '@/utils/request'

export const index = (params) => {
  console.log('menus=>service=>index', params)
  return request({
    url: '/menus',
    method: 'get',
    params,
  }).then(result => {
    if (result.data?.list) {
      // eslint-disable-next-line no-param-reassign
      result.data.list = result.data.list.map(item => ({...item, parent: item.parent || '0'}))
    }
    return result
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
