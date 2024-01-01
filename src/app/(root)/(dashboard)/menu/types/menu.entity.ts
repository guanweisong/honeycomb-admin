import type { BaseEntity } from '@/types/BaseEntity';
import { MultiLang } from '@/types/MulitLang';
import type { MenuType } from './MenuType';

export interface MenuEntity extends BaseEntity {
  id: string;
  power: number;
  type: MenuType;
  title: MultiLang;
  path?: string;
  parent?: string;
}
