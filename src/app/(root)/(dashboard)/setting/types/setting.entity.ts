import type { BaseEntity } from '@/types/BaseEntity';

export interface SettingEntity extends BaseEntity {
  id: string;
  siteName: string;
  siteSubName: string;
  siteSignature: string;
  siteCopyright: string;
  siteRecordNo: string;
  siteRecordUrl: string;
}
