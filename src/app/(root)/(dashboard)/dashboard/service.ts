import request from '@/utils/request';
import type { StatisticsIndexResponse } from './types/statistics.index.response';

export default class DashboardService {
  static index = (): Promise<StatisticsIndexResponse> => {
    console.log('statistic=>service=>index');
    return request({
      url: '/statistic',
      method: 'get',
    });
  };
}
