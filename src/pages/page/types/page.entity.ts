import type { BaseEntity } from '@/types/BaseEntity';
import type { PageStatus } from '@/pages/page/types/PageStatus';

export interface PageAuthorReadonly {
  _id: string;
  user_name: string;
}

export interface PageEntity extends BaseEntity {
  _id: string;
  page_views: number;
  page_title: string;
  page_content: string;
  page_status: PageStatus;
  page_author: string | PageAuthorReadonly;
}
