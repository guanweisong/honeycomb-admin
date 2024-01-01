import type { BaseEntity } from '@/types/BaseEntity';
import { MultiLang } from '@/types/MulitLang';
import type { PageStatus } from './PageStatus';

export interface PageAuthorReadonly {
  id: string;
  name: string;
}

export interface PageEntity extends BaseEntity {
  id: string;
  views: number;
  title: MultiLang;
  content: MultiLang;
  status: PageStatus;
  author: string | PageAuthorReadonly;
}
