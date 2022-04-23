import type { PaginationRequest } from '@/types/PaginationRequest';
import type { PageStatus } from './PageStatus';

export interface PageIndexListRequest extends PaginationRequest {
  page_title?: string;
  page_status?: PageStatus[];
}
