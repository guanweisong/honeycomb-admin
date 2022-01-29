import type { BaseEntity } from '@/types/BaseEntity';

export interface TagEntity extends BaseEntity {
  _id: string;
  tag_name: string;
}
