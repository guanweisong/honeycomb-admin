import type { BaseEntity } from '@/types/BaseEntity';
import { MultiLang } from '@/types/MulitLang';

export interface TagEntity extends BaseEntity {
  id: string;
  name: MultiLang;
}
