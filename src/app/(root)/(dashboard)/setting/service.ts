import { BaseResponse } from '@/types/BaseResponse';
import request from '@/utils/request';
import type { SettingEntity } from './types/setting.entity';
import type { SettingUpdateResponse } from './types/setting.update.response';

export default class SettingService {
  static querySetting = (): Promise<BaseResponse<SettingEntity>> => {
    return request({
      url: '/setting',
      method: 'get',
    });
  };

  static update = (id: string, params: SettingEntity): Promise<SettingUpdateResponse> => {
    return request({
      url: `/setting/${id}`,
      method: 'patch',
      data: params,
    });
  };
}
