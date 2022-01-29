import type { EnableType } from '@/types/EnableType';
import type { BaseEntity } from '@/types/BaseEntity';

export interface CategoryEntity extends BaseEntity {
  _id: string;
  category_title: string;
  category_title_en: string;
  category_parent?: string;
  category_description?: string;
  category_status: EnableType;
  created_at: string;
  updated_at: string;
  deep_path: number;
}
