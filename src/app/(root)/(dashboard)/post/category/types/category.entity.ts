import type { BaseEntity } from '@/types/BaseEntity';
import type { EnableType } from '@/types/EnableType';
import { MultiLang } from '@/types/MulitLang';

export interface CategoryEntity extends BaseEntity {
  id: string;
  title: MultiLang;
  path: string;
  parent?: string;
  description?: MultiLang;
  status: EnableType;
  createdAt: string;
  updatedAt: string;
  deepPath: number;
}
