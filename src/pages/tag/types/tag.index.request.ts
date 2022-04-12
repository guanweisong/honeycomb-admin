import type { PaginationRequest } from '@/types/PaginationRequest';

export interface TagIndexRequest extends PaginationRequest {
  tag_name?: string;
}
