import request from '@/utils/request'

export const index = () => {
  console.log('statistics=>service=>index')
  return request({
    url: '/statistics',
    method: 'get',
  })
}
