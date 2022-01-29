import type { BaseEntity } from '@/types/BaseEntity';

export interface SettingEntity extends BaseEntity {
  _id: string;
  site_name: string;
  site_subName: string;
  site_signature: string;
  site_copyright: string;
  site_record_no: string;
  site_record_url: string;
}
