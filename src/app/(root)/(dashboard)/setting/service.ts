import { BaseResponse } from '@/types/BaseResponse';
import request from '@/utils/request';
import type { SettingEntity } from './types/setting.entity';
import type { SettingUpdateResponse } from './types/setting.update.response';

export const querySetting = (): Promise<BaseResponse<SettingEntity>> => {
  return request({
    url: '/setting',
    method: 'get',
  });
};

export const update = (id: string, params: SettingEntity): Promise<SettingUpdateResponse> => {
  return request({
    url: `/setting/${id}`,
    method: 'patch',
    data: params,
  });
};
