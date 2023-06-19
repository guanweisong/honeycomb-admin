import type { EnableType } from '@/types/EnableType';
import type { BaseEntity } from '@/types/BaseEntity';

export interface CategoryEntity extends BaseEntity {
  id: string;
  title: string;
  titleEn: string;
  parent?: string;
  description?: string;
  status: EnableType;
  createdAt: string;
  updatedAt: string;
  deepPath: number;
}
