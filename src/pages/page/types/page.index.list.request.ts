import type { PaginationRequest } from '@/types/PaginationRequest';
import type { PageStatus } from './PageStatus';

export interface PageIndexListRequest extends PaginationRequest {
  title?: string;
  status?: PageStatus[];
}
