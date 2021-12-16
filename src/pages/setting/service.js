import request from '@/utils/request'

export const update = (id, params) => {
  console.log('settings=>service=>update', id, params)
  return request({
    url: `/settings/${id}`,
    method: 'put',
    data: params,
  })
}
