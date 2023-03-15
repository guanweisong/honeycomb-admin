import request from '@/utils/request';
import type { StatisticsIndexResponse } from '@/pages/dashboard/types/statistics.index.response';

export const index = (): Promise<StatisticsIndexResponse> => {
  console.log('statistic=>service=>index');
  return request({
    url: '/statistic',
    method: 'get',
  });
};
