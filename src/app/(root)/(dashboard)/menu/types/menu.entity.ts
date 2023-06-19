import type { BaseEntity } from '@/types/BaseEntity';
import type { MenuType } from './MenuType';

export interface MenuEntity extends BaseEntity {
  id: string;
  power: number;
  type: MenuType;
  title: string;
  titleEn?: string;
  parent?: string;
}
