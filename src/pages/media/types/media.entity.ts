import type { BaseEntity } from '@/types/BaseEntity';

export interface MediaEntity extends BaseEntity {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  key: string;
}
