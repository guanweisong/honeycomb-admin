import type { PaginationRequest } from '@/types/PaginationRequest';

export interface PostIndexRequest extends PaginationRequest {
  post_title?: string;
}
