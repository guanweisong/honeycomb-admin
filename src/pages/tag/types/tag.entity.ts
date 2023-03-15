import type { BaseEntity } from '@/types/BaseEntity';

export interface TagEntity extends BaseEntity {
  id: string;
  name: string;
}
