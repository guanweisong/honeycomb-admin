import type { BaseEntity } from '@/types/BaseEntity';

export interface MediaEntity extends BaseEntity {
  _id: string;
  media_name: string;
  media_type: string;
  media_url: string;
  media_size: number;
  media_key: string;
}
