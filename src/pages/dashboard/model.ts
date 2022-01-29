import { createModel } from 'hox';
import { useState } from 'react';
import * as statisticsService from './service';
import type { StatisticsType } from '@/pages/dashboard/types/StatisticsType';

function UseStatistics() {
  const [statistics, setStatistics] = useState<StatisticsType>();

  const index = async () => {
    console.log('statistics=>model=>index');
    const result = await statisticsService.index();
    if (result.status === 200) {
      setStatistics(result.data);
    }
  };

  return {
    statistics,
    index,
  };
}
export default createModel(UseStatistics);
