import type { BaseEntity } from '@/types/BaseEntity';
import type { MenuType } from '@/pages/menu/types/MenuType';

export interface MenuEntity extends BaseEntity {
  _id: string;
  power: number;
  type: MenuType;
  category_title?: string;
  category_title_en?: string;
  page_title?: string;
  parent?: string;
}
