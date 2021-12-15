import request from '@/utils/request'

export const login = (params) => {
  console.log('login=>service=>index', params)
  return request({
    url: '/auth/login',
    method: 'post',
    data: params,
  })
}
