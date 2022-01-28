import type { EnableType } from '@/types/EnableType';

export interface CategoryEntity {
  _id: string;
  category_title: string;
  category_title_en: string;
  category_parent?: string;
  category_description?: string;
  category_status: EnableType;
}
