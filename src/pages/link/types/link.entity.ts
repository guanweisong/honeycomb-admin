import type { EnableType } from '@/types/EnableType';
import type { BaseEntity } from '@/types/BaseEntity';

export interface LinkEntity extends BaseEntity {
  _id: string;
  link_url: string;
  link_name: string;
  link_description: string;
  link_status: EnableType;
}
