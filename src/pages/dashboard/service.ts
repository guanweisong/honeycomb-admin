import request from '@/utils/request';

export const index = (): Promise<any> => {
  console.log('statistics=>service=>index');
  return request({
    url: '/statistics',
    method: 'get',
  });
};
