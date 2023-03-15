import type { PaginationRequest } from '@/types/PaginationRequest';

export interface TagIndexRequest extends PaginationRequest {
  name?: string;
}
