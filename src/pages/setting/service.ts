import request from '@/utils/request';
import type { SettingEntity } from '@/pages/setting/types/setting.entity';
import type { SettingUpdateResponse } from '@/pages/setting/types/setting.update.response';
import type { SettingQueryResponse } from '@/pages/setting/types/setting.query.response';

export const setSettingInfo = (): Promise<SettingQueryResponse> => {
  console.log('app=>service=>setSettingInfo');
  return request({
    url: '/settings',
    method: 'get',
  });
};

export const update = (id: string, params: SettingEntity): Promise<SettingUpdateResponse> => {
  console.log('settings=>service=>update', id, params);
  return request({
    url: `/settings/${id}`,
    method: 'put',
    data: params,
  });
};
