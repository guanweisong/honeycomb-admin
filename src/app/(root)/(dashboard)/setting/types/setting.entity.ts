import type { BaseEntity } from '@/types/BaseEntity';
import { MultiLang } from '@/types/MulitLang';

export interface SettingEntity extends BaseEntity {
  id: string;
  siteName: MultiLang;
  siteSubName: MultiLang;
  siteSignature: MultiLang;
  siteCopyright: MultiLang;
  siteRecordNo: string;
  siteRecordUrl: string;
}
