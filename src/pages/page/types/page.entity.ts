import type { BaseEntity } from '@/types/BaseEntity';
import type { PageStatus } from '@/pages/page/types/PageStatus';

export interface PageAuthorReadonly {
  id: string;
  name: string;
}

export interface PageEntity extends BaseEntity {
  id: string;
  views: number;
  title: string;
  content: string;
  status: PageStatus;
  author: string | PageAuthorReadonly;
}
