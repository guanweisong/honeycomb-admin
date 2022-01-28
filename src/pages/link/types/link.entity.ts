import type { EnableType } from '@/types/EnableType';

export interface LinkEntity {
  _id: string;
  link_url: string;
  link_name: string;
  link_description: string;
  link_status: EnableType;
}
