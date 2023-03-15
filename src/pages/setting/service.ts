import request from '@/utils/request';
import type { SettingEntity } from '@/pages/setting/types/setting.entity';
import type { SettingUpdateResponse } from '@/pages/setting/types/setting.update.response';
import { BaseResponse } from '@/types/BaseResponse';

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
