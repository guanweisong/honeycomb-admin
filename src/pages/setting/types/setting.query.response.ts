import type { BaseResponse } from '@/types/BaseResponse';
import type { SettingEntity } from '@/pages/setting/types/setting.entity';

export interface SettingQueryResponse extends BaseResponse<SettingEntity[]> {}
